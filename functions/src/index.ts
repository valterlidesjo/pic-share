import { setGlobalOptions } from "firebase-functions";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { getStorageImageName } from "./services/getStorageImageName";
import {
  onDocumentCreated,
  onDocumentDeleted,
  onDocumentUpdated,
  QueryDocumentSnapshot,
} from "firebase-functions/firestore";

admin.initializeApp();

setGlobalOptions({ maxInstances: 10 });

const storage = admin.storage();

export const deleteImageFromStorage = onDocumentDeleted(
  "images/{imageId}",
  async (event: functions.CloudEvent<QueryDocumentSnapshot | undefined>) => {
    if (!event.data) {
      console.log("No data found in event.data for deleted document.");
      return null;
    }
    const deletedImage = event.data.data();
    const imageURL = deletedImage?.imageUrl;
    if (!imageURL) {
      console.log(
        `Dokument ${event.id} hade ingen 'imageUrl'. Ingen fil att radera från Storage.`
      );
      return null;
    }
    const storagePath = getStorageImageName(imageURL);
    if (!storagePath) {
      console.error(
        `Kunde inte extrahera Storage-sökvägen från imageUrl för dokument ${event.id}: ${imageURL}`
      );
      return null;
    }
    const bucket = storage.bucket();
    const file = bucket.file(storagePath);

    try {
      await file.delete();
      console.log("File deleted successfully from storage:", storagePath);
      return null;
    } catch (error) {
      if (error instanceof Error && (error as any).code === 404) {
        console.warn(
          `Filen '${storagePath}' hittades inte i Storage för dokument ${event.id}. Den kanske redan var raderad.`
        );
      } else {
        console.error(
          `Fel vid radering av fil '${storagePath}' från Storage för dokument ${event.id}:`,
          error
        );
      }
      return null;
    }
  }
);

export const addEmailToImageOnUserCreate = onDocumentCreated(
  "users/{userId}",
  async (event) => {
    const userDoc = event.data?.data();
    if (!userDoc) return null;

    const userId = event.params.userId;
    const userEmail = userDoc.email;
    if (!userEmail) return null;

    const db = admin.firestore();

    const imagesSnapshot = await db
      .collection("images")
      .where("userId", "==", userId)
      .get();

    if (imagesSnapshot.empty) {
      console.log("No images found for user: ", userId);
      return null;
    }
    const batch = db.batch();
    imagesSnapshot.forEach((doc) => {
      batch.update(doc.ref, { email: userEmail });
    });

    await batch.commit();
    console.log("Email added to images for user: ", userId);
    return null;
  }
);

export const addUsernameToImageOnUserUpdated = onDocumentUpdated(
  "users/{userId}",
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!before || !after) return null;

    const userId = event.params.userId;
    const beforeUsername: string = before.username;
    const afterUsername: string = after.username;
    if (afterUsername && beforeUsername !== afterUsername) {
      const db = admin.firestore();

      const imagesSnapshot = await db
        .collection("images")
        .where("userId", "==", userId)
        .get();

      if (imagesSnapshot.empty) {
        console.log("No images found for user: ", userId);
        return null;
      }
      const batch = db.batch();
      imagesSnapshot.forEach((doc) => {
        batch.update(doc.ref, { username: afterUsername });
      });

      await batch.commit();
      console.log("Username added to images for user: ", userId);
    }
    return null;
  }
);
