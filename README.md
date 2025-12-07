save user in db only after email verification
project display in main page fetching using django rest api 
create a project model same exact like my frontend project design 
github_release_url = models.URLField(max_length=500, blank=True, null=True)
version = models.CharField(max_length=50, default="v1.0")


//
STEP-BY-STEP: SECURE FILE STORAGE USING GITHUB (EASY GUIDE)
STEP 1 — Create a NEW private GitHub repository

Go to GitHub → New Repository

Name it: my-project-files

Select option: Private

Create repo

Now no one can access this repo except you.

STEP 2 — Create a RELEASE

Open your repository

Click Releases (right side or “Code → Releases”)

Click Draft a new release

Under “Attach binaries”, upload your ZIP file

Publish the release

Your file is now stored securely inside GitHub.

⚠ It is NOT accessible publicly.
⚠ User cannot download it without login + permission.

STEP 3 — Copy the RELEASE download link

After publishing the release:

You will see something like:

https://github.com/yourname/my-project-files/releases/download/v1.0/project.zip


Copy this link — you will need it later.

But DO NOT put it directly inside your React app, because:

Users cannot download it (private repo)

They will see "404 Not found"

This is good because it keeps it secure

Django will later generate access

STEP 4 — TEST SECURITY

Try opening that link in these situations:

✔ Test 1 — Open in incognito mode

You will see:

404 Not Found


This is GOOD.
It means files are secure.

✔ Test 2 — Send link to a friend

They will also see:

404 Not Found


This proves:

🔐 Users cannot share the link
🔐 Users cannot download the file directly
🔐 Your project is protected
STEP 5 — Understand how Django will access file later

(You don’t need to do this part now — just explaining simply)

Later:

Django will use a GitHub API token

It will download the file from your private repo

Then Django will send the file to the user securely

User never gets the real GitHub URL.
So it stays completely secure.

🎉 DONE — You now have a secure storage system

You only need these GitHub steps:

1️⃣ Create private repo
2️⃣ Upload files in Releases
3️⃣ Copy download link
4️⃣ Verify link does NOT work for public users
5️⃣ Use Django (later) to serve downloads securely

This is the easiest and safest free method.
//

contact
checkout
payment
orders 

about us 
download invoice from my orders directly 
not displaying image of project in donwload page and my order page 

design page title-Curated Inspiration
"Design.Vault
Explore our gallery of pixel-perfect interfaces, UI kits, and immersive design systems."
 , about us , contact page , profile is not responsive , and cart icon iss not showing in navbar in mobile screen , change mobile menu navbar toggle design navlinks is so big bold text i want light professional design 