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
        username: currentUser.username,
        account_age: 
            accountAge.years + " Year(s) " +
            accountAge.months + " Month(s) " +
            accountAge.days + " Day(s)",
        bio: currentUser.bio,
    }
    return {...defaultParams, ...obj}
}

// Routes for the user page
router.route('/')
    .get(async (req, res) => {
        return res.render("user", await userRender(req.session.user, {
            title: "Poems",
            poems: true
        }));
    })

router.route('/history')
    .get(async (req, res) => {
        return res.render("user", await userRender(req.session.user, {
            title: "History",
            history: true
        }));
    })

router.route('/liked-poems')
    .get(async (req, res) => {
        return res.render("user", await userRender(req.session.user, {
            title: "Liked Poems",
            liked_poems: true
        }));
    })

router.route('/tagged-poems')
    .get(async (req, res) => {
        return res.render("user", await userRender(req.session.user, {
            title: "Tagged Poems",
            tagged_poems: true
        }));
    })

router.route('/followers')
    .get(async (req, res) => {
        return res.render("user", await userRender(req.session.user, {
            title: "Followers",
            followers: true
        }));
    })

router.route('/following')
    .get(async (req, res) => {
        return res.render("user", await userRender(req.session.user, {
            title: "Following",
            following: true
        }));
    })

router.route('/history')
    .get(async (req, res) => {
        return res.render("user", await userRender(req.session.user, {
            title: "Following",
            following: true
        }));
    })


router.route('/edit')
    .get(async (req, res) => {
        return res.render("user", await userRender(req.session.user, {
            title: "Edit Profile",
            edit: true
        }));
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