import { setGlobalOptions, CloudEvent, logger } from "firebase-functions/v2";
import * as admin from "firebase-admin";
import { getStorageImageName } from "./services/getStorageImageName";
import {
  onDocumentCreated,
  onDocumentDeleted,
  onDocumentUpdated,
  QueryDocumentSnapshot,
} from "firebase-functions/v2/firestore";
import { FieldValue } from "firebase-admin/firestore";

admin.initializeApp();

setGlobalOptions({ maxInstances: 10 });

const storage = admin.storage();

export const deleteImageFromStorage = onDocumentDeleted(
  "images/{imageId}",
  async (event: CloudEvent<QueryDocumentSnapshot | undefined>) => {
    if (!event.data) {
      logger.log("No data found in event.data for deleted document.");
      return null;
    }
    const deletedImage = event.data.data();
    const imageURL = deletedImage?.imageUrl;
    if (!imageURL) {
      logger.log(
        `Dokument ${event.id} hade ingen 'imageUrl'. Ingen fil att radera från Storage.`
      );
      return null;
    }
    const storagePath = getStorageImageName(imageURL);
    if (!storagePath) {
      logger.error(
        `Kunde inte extrahera Storage-sökvägen från imageUrl för dokument ${event.id}: ${imageURL}`
      );
      return null;
    }
    const bucket = storage.bucket();
    const file = bucket.file(storagePath);

    try {
      await file.delete();
      logger.log("File deleted successfully from storage:", storagePath);
      return null;
    } catch (error) {
      if (error instanceof Error && (error as any).code === 404) {
        logger.warn(
          `Filen '${storagePath}' hittades inte i Storage för dokument ${event.id}. Den kanske redan var raderad.`
        );
      } else {
        logger.error(
          `Fel vid radering av fil '${storagePath}' från Storage för dokument ${event.id}:`,
          error
        );
      }
      return null;
    }
  }
);

export const updateConversationLastUpdated = onDocumentCreated(
  "conversations/{conversationId}/messages/{messageId}",
  async (event: CloudEvent<QueryDocumentSnapshot | undefined>) => {
    if (!event.data) {
      logger.log("No data found in event.data in document.");
      return;
    }
    const conversationRef = event.data.ref.parent.parent;
    if (!conversationRef) {
      logger.error("Could not find the parent conversation document.");
      return;
    }
    try {
      await conversationRef.update({
        updatedAt: FieldValue.serverTimestamp(),
      });
      console.log(`Succesfully updated time at ${conversationRef.id}`);
    } catch (error) {
      console.error(`Error updating time at ${conversationRef.id}`);
    }
  }
);

export const deleteEmptyAlbums = onDocumentDeleted(
  "albums/{alumId}/images/{imageId}",
  async (event) => {
    if (!event.data) {
      logger.log("No data found in event.data in document.");
      return;
    }

    const albumRef = event.data.ref.parent.parent;
    if (!albumRef) {
      logger.error("Could not find the parent album document.");
      return;
    }

    const imagesCollectionRef = albumRef.collection("images");
    const snapshot = await imagesCollectionRef.limit(1).get();

    if (snapshot.empty) {
      await albumRef.delete();
      logger.info(
        `Album with ID ${albumRef.id} is now empty and has been deleted.`
      );
    } else {
      logger.info(
        `Album with ID ${albumRef.id} is not empty, there are still images left.`
      );
    }
  }
);

export const deleteCommentAnswers = onDocumentDeleted(
  "images/{imageId}/comments/{commentId}",
  async (event: CloudEvent<QueryDocumentSnapshot | undefined>) => {
    if (!event.data) {
      console.log("No data found in event.data for deleted image.");
      return null;
    }
    const deletedCommentRef = event.data.ref;
    const subCollectionRef = deletedCommentRef.collection("commentComments");

    const snapshot = await subCollectionRef.get();
    if (snapshot.empty) {
      logger.log(
        "Subcollection commentComments is already empty, no documents to delete."
      );
      return null;
    }

    const batch = admin.firestore().batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    logger.log(`Successfully deleted all documents from subcollection at path:
      ${subCollectionRef.path}`);
    return null;
  }
);

export const deleteImageTracks = onDocumentDeleted(
  "images/{imageId}",
  async (event) => {
    if (!event.data) {
      console.log("No data found in event.data for deleted document.");
      return null;
    }
    const imageId = event.params.imageId;
    const deletedImage = event.data.data();
    const userId = deletedImage.userId;

    if (!userId) {
      console.log(`Dokument ${event.id} hade ingen 'userId'.`);
      return null;
    }

    const db = admin.firestore();
    const batch = db.batch();

    const deletedImageRef = event.data.ref;
    const commentsSubCollectionRef = deletedImageRef.collection("comments");
    const commentsSnapshot = await commentsSubCollectionRef.get();

    if (!commentsSnapshot.empty) {
      commentsSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      logger.log("Added comments subcollection docs to batch for deletion.");
    }

    const albumSnapshot = await db
      .collection("albums")
      .where("createdBy", "==", userId)
      .get();

    if (!albumSnapshot.empty) {
      const albumPromises = albumSnapshot.docs.map(async (albumDoc) => {
        const albumRef = albumDoc.ref;

        const imageSubcollectionSnapshot = await albumRef
          .collection("images")
          .where("userId", "==", userId)
          .where("imageId", "==", imageId)
          .get();

        imageSubcollectionSnapshot.docs.forEach((imageDoc) => {
          batch.delete(imageDoc.ref);
        });
      });
      await Promise.all(albumPromises);
      logger.log("Added album image documents to the batch for deletion.");
    }

    const likesSnapshot = await db
      .collection("likes")
      .where("imageId", "==", imageId)
      .get();

    if (!likesSnapshot.empty) {
      likesSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      logger.log("Added likes documents to the batch for deletion.");
    }

    await batch.commit();
    logger.log(`Successfully deleted all related tracks for image ${imageId}`);
    return;
  }
);

export const deleteUserTracks = onDocumentDeleted(
  "users/{userId}",
  async (event) => {
    const userId = event.params.userId;
    const db = admin.firestore();

    if (!userId) {
      console.log(`Dokument ${event.id} hade ingen 'userId'.`);
      return null;
    }
    const batch = db.batch();

    const imagesSnapshot = await db
      .collection("images")
      .where("userId", "==", userId)
      .get();

    if (!imagesSnapshot.empty) {
      imagesSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      logger.log("Added image documents to the batch for deletion.");
    }

    const followsSnapshot = await db
      .collection("followers")
      .where("followerId", "==", userId)
      .get();

    if (!followsSnapshot.empty) {
      followsSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      logger.log("Added follow documents to the batch for deletion.");
    }

    const conversationSnapshot = await db
      .collection("conversations")
      .where("userIds", "array-contains", userId)
      .get();

    if (!conversationSnapshot.empty) {
      const conversationPromises = conversationSnapshot.docs.map(
        async (convDoc) => {
          const convRef = convDoc.ref;
          const messageSnapshot = await convRef.collection("messages").get();
          messageSnapshot.docs.forEach((messageDoc) => {
            batch.delete(messageDoc.ref);
          });
        }
      );
      await Promise.all(conversationPromises);
      logger.log(
        "Added conversation and message documents to the batch for deletion."
      );
      conversationSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
    } else {
      logger.log("Could not find any conversations with user: ", userId);
    }

    await batch.commit();
    logger.log("User traks: ", userId);
    return null;
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
