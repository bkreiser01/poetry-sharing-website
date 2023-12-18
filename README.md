# poetry-sharing-website

A website for sharing poetry by Adrien Huet, Brandon Kreiser, Joseph Vasallo, Roger Shagawat. This project was completed for our final project in CS 546

**Project Walkthrough**
[https://youtu.be/ASKNl8nlNlM]()

**Repository Link**
[https://github.com/bkreiser01/poetry-sharing-website]()

## Core Features
**Main Page:**

* Users can search
* Show’s poems from poets the user follows

**Poems**

* Poems will be written in markdown
* Poems can have titles (not required on poem)
* Poems can have one link which should link to a reading of their poem (not required on poem)
* Users can edit their own poems 
* Users are able to delete their poems
* Users can delete their own poems
* Users will be able to see poems they have tagged

**Commenting**

* Users can comment on other people’s poems
* Comments must be linked to a tag they added to expand their analysis or feelings on the poem

**Tags**

* On each poem tags will be hidden until the user unhides them
* User’s can tag any poem including their own (users will be limited in how many tags they can use per poem)
* If a tag is used multiple times it will display the number of times that tag was used on the poem next to it
* Users can click on tags to see poems that have been tagged with the same tag

**User page**

* Other users will be able to follow users to add them to their main page feed
* User pages will be editable by the user who owns them
* It will show the tags most users tag their poems with
* It will show the tags they most use on other people’s poems
* User page will show the poems they have written
* There will be a biography with links to other websites or social media
* Other users will be able to see poems the user has tagged

**Searching**

* User’s can search by tag, user, and poem title
* They can also search by poem content

**History**

* Users can see the history of poems they have viewed

**Favorite poems**

* Users can favorite a poem to add a poem to their favorites which would have its own page per user

## Extra Features

* User-specific profile picture
* Popular Poems page
* Popular tags page
* "There will be a big dog in a grassy field eating a big bone with the marrow"


## How to's
### Install the website
* Ensure you have mongodb installed on your machine
* run `npm i`
* run `npm start`
* Go to your browser and type in the url bar `http://localhost:3000`

### Running the seed script

* Go to your install location
* Ensure you have mongodb running
* run `npm run seed`

### Logging in
To log in feel free to use any of these users
**bkreiser**, **rshagawat**, **jvasallo**, **ahuet** who's password is **Password@01**, or make your own!
