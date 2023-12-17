// Package Imports
import { Router } from "express";
const router = Router();
import xss from "xss";

// Local Imports
import validation from "../helpers/validation.js";
import user from "../data/user.js";


let userRender = async (userId, obj) => {
    let currentUser = await user.getById(userId._id)
    let accountAge = await user.calulcateAccountAge(currentUser._id)
    let defaultParams = {
        layout: "default",
        userId: currentUser._id,
        username: currentUser.username,
        account_age: 
            accountAge.years + " Year(s) " +
            accountAge.months + " Month(s) " +
            accountAge.days + " Day(s)",
        bio: currentUser.bio,
        email:currentUser.email,
    }
    return {...defaultParams, ...obj}
}

let userRenderPublic = async (userId, obj) => {
    let userData = await user.getById(userId)
    let accountAge = await user.calulcateAccountAge(userId)
    let defaultParams = {
        layout: "default",
        title: `${userData.username}'s ${obj.title}`,
        username: userData.username,
        account_age: 
            accountAge.years + " Year(s) " +
            accountAge.months + " Month(s) " +
            accountAge.days + " Day(s)",
        bio: userData.bio,
    }
    delete obj.title
    return {...defaultParams, ...obj}
}

// Routes for the user page
router.route('/')
    .get(async (req, res) => {
        try {
            return res.render("user", await userRender(req.session.user, {
                title: "Your Account",
                poems: true
            }));
        } catch (e) {
            return res.status(404).render('error', { error: e.message });
        }
    })

router.route('/history')
    .get(async (req, res) => {
        try {
            return res.render("user", await userRender(req.session.user, {
                title: "History",
                history: true
            }));   
        } catch (e) {
            return res.status(404).render('error', { error: e.message });
        }
    })

router.route('/liked-poems')
    .get(async (req, res) => {
        try {
            return res.render("user", await userRender(req.session.user, {
                title: "Liked Poems",
                liked_poems: true
            }));   
        } catch (e) {
            return res.status(404).render('error', { error: e.message });
        }
    })

router.route('/tagged-poems')
    .get(async (req, res) => {
        try {
            return res.render("user", await userRender(req.session.user, {
                title: "Tagged Poems",
                tagged_poems: true
            }));   
        } catch (e) {
            return res.status(404).render('error', { error: e.message });
        }
    })

router.route('/followers')
    .get(async (req, res) => {
        try {
            return res.render("user", await userRender(req.session.user, {
                title: "Followers",
                followers: true
            }));          
        } catch (e) {
            return res.status(404).render('error', { error: e.message });
        }
    })

router.route('/following')
    .get(async (req, res) => {
        try {
            return res.render("user", await userRender(req.session.user, {
                title: "Following",
                following: true
            }));   
        } catch (e) {
            return res.status(404).render('error', { error: e.message });
        }
    })

router.route('/history')
    .get(async (req, res) => {
        try {
            return res.render("user", await userRender(req.session.user, {
                title: "History",
                methodName: "getHistory",
                following: true
            }));   
        } catch (e) {
            return res.status(404).render('error', { error: e.message });
        }
    })


router.route('/edit')
    .get(async (req, res) => {
        try {
            return res.render("user", await userRender(req.session.user, {
                title: "Edit Profile",
                edit: true
            }));   
        } catch (e) {
            return res.status(404).render('error', { error: e.message });
        }
    })
    .patch(async (req, res) => {
        try {
            let userData

            if (req.body.username != undefined) {
                req.body.username = validation.checkUsername(xss(req.body.username), "username")
                userData = await user.updateUsername(req.session.user._id, req.body.username)
                req.session.user.username = req.body.username
            }

            if (req.body.email != undefined) {
                req.body.email = validation.checkEmail(xss(req.body.email), "email")
                userData = await user.updateEmail(req.session.user._id, req.body.email)
                req.session.user.email = req.body.email
            }

            if (req.body.password != undefined) {
                req.body.password = validation.checkPassword(xss(req.body.password), "password")
                userData = await user.updatePassword(req.session.user._id, req.body.password)
            }

            if (req.body.bio != undefined) {
                req.body.bio = validation.checkString(xss(req.body.bio), "bio")
                userData = await user.updateBio(req.session.user._id, req.body.bio)
                req.session.user.bio = req.body.bio
            }

            if (userData == undefined) {
                return res.status(200).json({ success: "No fields were updated" });
            }
            return res.status(200).json({ success: "User updated successfully" });

        } catch (e) {
            return res.status(500).json({ error: e.message });
        } 
    })

router.route('/:id')
    .get(async (req, res) => {
        try {
            req.params.id = validation.checkId(xss(req.params.id), "id")
            return res.render("user-view", await userRenderPublic(req.params.id, {
                title: "Account",
                userId: req.session.user._id,
                userViewId: req.params.id,
                poems: true
            }));
        } catch (e) {
            return res.status(404).render('error', { error: e.message });
        }
    })

router.route('/:id/followers')

    .get(async (req, res) => {
        try {
            req.params.id = validation.checkId(xss(req.params.id), "id")
            return res.render("user-view", await userRenderPublic(req.params.id, {
                title: "Followers",
                userId: req.session.user._id,
                userViewId: req.params.id,
                followers: true
            }));   
        } catch (e) {
            return res.status(404).render('error', { error: e.message });
        }
    })

router.route('/:id/following')
    .get(async (req, res) => {
        try {
            req.params.id = validation.checkId(xss(req.params.id), "id")
            return res.render("user-view", await userRenderPublic(req.params.id, {
                title: "Following",
                userId: req.session.user._id,
                userViewId: req.params.id,
                following: true
            }));   
        } catch (e) {
            return res.status(404).render('error', { error: e.message });
        }
    })

router.route('/:id/tagged-poems')
    .get(async (req, res) => {
        try {
            req.params.id = validation.checkId(xss(req.params.id), "id")
            return res.render("user-view", await userRenderPublic(req.params.id, {
                title: "Tagged Poems",
                userId: req.session.user._id,
                userViewId: req.params.id,
                tagged_oems: true
            }));   
        } catch (e) {
            return res.status(404).render('error', { error: e.message });
        }
    })

router.route('/:id/favorite-tags')
    .get(async (req, res) => {
        try {
            req.params.id = validation.checkId(xss(req.params.id), "id")
            let favTags = await user.getFavoriteTags(req.params.id);
            res.status(200).json(favTags);
        } catch (e) {
            res.status(500).render("error", {
                title: "Error",
                error: e,
            });
        }
    })

router.route('/searchByUsername/:username')
    .get(async (req, res) => {
        try {
            req.params.username = validation.checkUsername(xss(req.params.username), "username")

            // Get the user
            let userData = await user.searchByUsername(req.params.username);

            // Return the user
            return res.status(200).json(userData);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    })

router.route('/searchById/:id')
    .get(async (req, res) => {
        try {
            req.params.id = validation.checkId(xss(req.params.id), "id")

            // Get the user
            let userData = await user.getById(req.params.id);

            delete userData.hashedPassword;

            // Return the userid
            return res.status(200).json(userData);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    })

router.route('/getPoems/:id')
    .get(async (req, res) => {
        try {
            req.params.id = validation.checkId(xss(req.params.id), "id")

            // Get the user
            let userData = await user.getById(req.params.id);

            // Return the user
            return res.status(200).json(userData.poemIds);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    })

router.route('/getLikedPoems/:id')
    .get(async (req, res) => {
        try {
            req.params.id = validation.checkId(xss(req.params.id), "id")

            // Get the user
            let userData = await user.getById(req.params.id);

            // Return the user
            return res.status(200).json(userData.favorites);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    })

router.route('/getTaggedPoems/:id')
    .get(async (req, res) => {
        try {
            req.params.id = validation.checkId(xss(req.params.id), "id")

            // Get the user
            let userData = await user.getById(req.params.id);

            // Return the user
            return res.status(200).json(userData.taggedPoems);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    })

router.route('/followers/:id')
    .get(async (req, res) => {
        try {
            req.params.id = validation.checkId(xss(req.params.id), "id")

            // Get the user
            let userData = await user.getById(req.params.id);

            // Return the user
            return res.status(200).json(userData.followers);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    })

router.route('/following/:id')
    .get(async (req, res) => {
        try {
            req.params.id = validation.checkId(xss(req.params.id), "id")

            // Get the user
            let userData = await user.getById(req.params.id);

            // Return the user
            return res.status(200).json(userData.following);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    })
    .post(async (req, res) => {
        try {
            req.params.id = validation.checkId(xss(req.params.id), "id")

            if (!req.session.user) {
                return res.status(401).json({ error: "You must be logged in to follow a user" });
            }

            // Follow the user
            let userData = await user.addFollowing(req.session.user._id, req.params.id);

            // Return the user
            return res.status(200).json(userData.following);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    })
    .delete(async (req, res) => {
        try {
            req.params.id = validation.checkId(xss(req.params.id), "id")

            if (!req.session.user) {
                return res.status(401).json({ error: "You must be logged in to unfollow a user" });
            }

            // Unfollow the user
            let userData = await user.deleteFollowing(req.session.user._id, req.params.id);

            // Return the user
            return res.status(200).json(userData.following);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    })

router.route('/getHistory/:id')
    .get(async (req, res) => {
        try {
            req.params.id = validation.checkId(xss(req.params.id), "id")
            
            // Get the user
            let userData = await user.getById(req.params.id);

            // Return the user
            return res.status(200).json(userData.recentlyViewedPoemIds);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    })
export default router