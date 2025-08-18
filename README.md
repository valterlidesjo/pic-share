
# PicShare - Social Media app

PicShare is a fun projected I made to develop and deepen my skills in Next.js and Firebase. 

Its my second project with this stack and I'm working on these techs because of my future internship at Done Services where I will be working with these techniques. 

A social media app seemed like a fun and challenging project where I could try out firebase fully. 

<strong>1. Firebase Authentication</strong>
First I used firebase authentication for anonymous authentication when I user first lands on the website. This in order to make it possible to upload pictures authenticated without creating an account. Then when you sign up with email and password your anonymous account is linked to your real account.
In order to fully complete your account and become a verified member you need to verify your email with email verification. 
Then you will be able to use the full app and be seen as a verified user.

2. Firestore Database
I used firestore as my database for images info, users, followers, followed users and comments. With this project I learned to work with connection between collection in a NoSQL database since I've only used SQL for more complex database solutions before. 
Using rules in firestore was also very instructive.

3. Firebase Storage
I used storage for storing all the images that the users upload. This for a more smooth UX and developer experience. It's a secury environment to store the images and then store the image url in firestore. 

4. Firebase Exstensions - Algolia
I used firebase exstension in order to use Algolia which is a search engine. I used algolia's instantsearch and indexing of my firestore database to be able to search for different users in the app. 

5. Firebase App Hosting
I used firebase app hosting to host my full stack application. It's a new feature from firebase which was complicated to figure out in the beginning (like with all fullstack hosting), but after figuring it out it was super smooth. New redpeploys with a github PR and super easy to rollback to an earlier verision of the app if you get problems with the latest. 

