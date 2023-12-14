// Package Imports
import { Router } from "express";
const router = Router();

// Local Imports
import validation from "../helpers/validation.js";
import user from "../data/user.js";


let userRender = async (currentUser, obj) => {
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
    }
    return {...defaultParams, ...obj}
}

let userRenderPublic = async (userId, obj) => {
    let userData = await user.getById(userId)
    let accountAge = await user.calulcateAccountAge(userId)
    let defaultParams = {
        layout: "default",
        title: `${userData.username}'s ${obj.title}`,
        userId: userId,
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

router.route('/:id')
    .get(async (req, res) => {
        try {
            return res.render("user-view", await userRenderPublic(req.params.id, {
                title: "Account",
                poems: true
            }));
        } catch (e) {
            return res.status(404).render('error', { error: e.message });
        }
    })

router.route('/:id/followers')

    .get(async (req, res) => {
        try {
            return res.render("user-view", await userRenderPublic(req.params.id, {
                title: "Followers",
                followers: true
            }));   
        } catch (e) {
            return res.status(404).render('error', { error: e.message });
        }
    })

router.route('/:id/following')
    .get(async (req, res) => {
        try {
            return res.render("user-view", await userRenderPublic(req.params.id, {
                title: "Following",
                following: true
            }));   
        } catch (e) {
            return res.status(404).render('error', { error: e.message });
        }
    })

//Public User Routes
router.route('/searchByUsername/:username')
    .get(async (req, res) => {
        try {
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
            // Get the user
            let userData = await user.getById(req.params.id);

            // Return the user
            return res.status(200).json(userData.taggedPoems);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    })

router.route('/getFollowers/:id')
    .get(async (req, res) => {
        try {
            // Get the user
            let userData = await user.getById(req.params.id);

            // Return the user
            return res.status(200).json(userData.followers);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    })

router.route('/getFollowing/:id')
    .get(async (req, res) => {
        try {
            // Get the user
            let userData = await user.getById(req.params.id);

            // Return the user
            return res.status(200).json(userData.following);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    })

router.route('/getHistory/:id')
    .get(async (req, res) => {
        try {
            // Get the user
            let userData = await user.getById(req.params.id);

            // Return the user
            return res.status(200).json(userData.recentlyViewedPoemIds);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    })

//Private User Routes. MUST BE AUTHENTICATED TO USE!!!
router.route('/delete')
    .delete(async (req, res) => {
        try {
            // Delete the user
            let userData = await user.deleteUser(req.session.user._id);

            // Log the user out
            return res.redirect('/logout')
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }   
    })
router.route('/update-username')
export default router