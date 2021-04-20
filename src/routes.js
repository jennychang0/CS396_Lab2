"use strict";

const resetDB = require("../config/scripts/populateDB")

const Companion = require("./schema/Companion");
const Doctor = require("./schema/Doctor");

const express = require("express");
const router = express.Router();


// completely resets your database.
// really bad idea irl, but useful for testing
router.route("/reset")
    .get((_req, res) => {
        resetDB(() => {
            res.status(200).send({
                message: "Data has been reset."
            });
        });
    });

router.route("/")
    .get((_req, res) => {
        console.log("GET /");
        res.status(200).send({
            data: "App is running."
        });
    });
    
// ---------------------------------------------------
// Edit below this line
// ---------------------------------------------------
router.route("/doctors")
    .get((req, res) => {
        console.log("GET /doctors");

        // already implemented:
        Doctor.find({})
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    })
    .post((req, res) => {
        console.log("POST /doctors");
        console.log(req.body);
        if (!req.body.name || !req.body.seasons){ //error not catching...idk why? am i going crazy?
            res.status(400).send({
                message: "name and seasons required for doctor"
            })
            return;
        }
        const newDoc = req.body;
        Doctor.create(newDoc).save()
            .then(doc => {
                res.status(201).send(doc);
            })
            .catch(err => {
                res.status(400).send({
                    message: "unable to save to db"
                })
            })
    });

// optional:
router.route("/doctors/favorites")
    .get((req, res) => {
        console.log(`GET /doctors/favorites`);
        res.status(501).send();
    })
    .post((req, res) => {
        console.log(`POST /doctors/favorites`);
        res.status(501).send();
    });
    
router.route("/doctors/:id")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}`);
        Doctor.findById(req.params.id)
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(404).send(err);
            });
    })
    .patch((req, res) => {
        console.log(`PATCH /doctors/${req.params.id}`);
        Doctor.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err =>{
                res.status(404).send({
                    message: "id not found"
                });
            })
    })
    .delete((req, res) => {
        console.log(`DELETE /doctors/${req.params.id}`);
        Doctor.findOneAndDelete({_id: req.params.id})
        .then(data => {
            if (data){
                res.status(200).send(null);
            } else {
                res.status(404).send({
                    message: "id not found"
                });
            }
        })
        .catch(err =>{
            res.status(500).send(err);
        })
    });
    
router.route("/doctors/:id/companions")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}/companions`);
        const findId = req.params["id"];
        Doctor.findById(findId)
            .then(artists => {
                if (!artists){
                    res.status(404).send("doctor not found");
                    return;
                }
            })
        
        Companion.find( {"doctors": {$in : findId}} )  
            .then(companions => {
                if (companions){
                    res.status(200).send(companions);
                    return;
                }
                else{
                    res.status(404).send("none found");
                    return;
                }
            })
    });
    

router.route("/doctors/:id/goodparent")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}/goodparent`);
        const findId = req.params["id"];
        Doctor.findById(findId)
            .then(artists => {
                if (!artists){
                    res.status(404).send("doctor not found");
                    return;
                }
            })
        
        Companion.find( {"doctors": {$in : findId}} )  
            .then(companions => {
                if (companions){
                    for (const comp of companions){
                        if (!comp.alive){
                            res.status(200).send(false);
                            return;
                        }
                    }
                    res.status(200).send(true);
                    return;
                }
                else{
                    res.status(404).send("none found");
                    return;
                }
            })
    });

// optional:
router.route("/doctors/favorites/:doctor_id")
    .delete((req, res) => {
        console.log(`DELETE /doctors/favorites/${req.params.doctor_id}`);
        res.status(501).send();
    });

router.route("/companions")
    .get((req, res) => {
        console.log("GET /companions");
        // already implemented:
        Companion.find({})
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    })
    .post((req, res) => {
        console.log("POST /companions");
        console.log(req.body);
        if ((!req.body.name) || (!req.body.seasons)){ //AGAIN error not catching...same as POST doctor
            res.status(400).send({
                message: "name and seasons required for doctor"
            })
            return;
        }
        const newDoc = req.body;
        Companion.create(newDoc).save()
            .then(doc => {
                res.status(201).send(doc);
            })
            .catch(err => {
                res.status(400).send({
                    message: "unable to save to db"
                })
            })
    });

router.route("/companions/crossover")
    .get((req, res) => {
        console.log(`GET /companions/crossover`);
    Companion.find({})
        .then(companions => {
            let compList = [];
            if (companions){
                for (const comp of companions){
                    if (comp.doctors.length > 1){
                        compList.push(comp);
                    }
                }
            }
            res.status(200).send(compList);
            return;
        })
        .catch(err => {
            res.status(500).send(err);
        });    
    });

// optional:
router.route("/companions/favorites")
    .get((req, res) => {
        console.log(`GET /companions/favorites`);
        res.status(501).send();
    })
    .post((req, res) => {
        console.log(`POST /companions/favorites`);
        res.status(501).send();
    })

router.route("/companions/:id")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}`);
        Companion.findById(req.params.id)
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(404).send(err);
        });
    })
    .patch((req, res) => {
        console.log(`PATCH /companions/${req.params.id}`);
        Companion.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err =>{
                res.status(404).send({
                    message: "id not found"
                });
            })
    })
    .delete((req, res) => {
        console.log(`DELETE /companions/${req.params.id}`);
        Companion.findOneAndDelete({_id: req.params.id})
        .then(data => {
            if (data){
                res.status(200).send(null);
            } else {
                res.status(404).send({
                    message: "id not found"
                });
            }
        })
        .catch(err =>{
            res.status(500).send(err);
        })
    });

router.route("/companions/:id/doctors")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}/doctors`);
        
        Companion.findById(req.params.id)
        .then(comp => {
            if (comp){
                let docList = [];
                Doctor.find({"_id": {$in : comp.doctors}})
                .then(doc => {
                    res.status(200).send(doc);
                    return;
                })
            }
            else{
                res.status(404).send("could not find this companion!");
                return;
            }
        })
        .catch(err => {
            res.status(404).send("Error occured");
        });
    });

router.route("/companions/:id/friends")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}/friends`);
        Companion.findById(req.params.id)
        .then(comp => {
            if (comp){
                Companion.find( {"_id" : {$ne : req.params.id}, "seasons" : {$in : comp.seasons} } )
                    .then (found_comp => {
                        if (found_comp){
                            res.status(200).send(found_comp);
                        }
                    })
            }
        })
        .catch(err => {
            res.status(404).send(err);
        })
    });

// optional:
router.route("/companions/favorites/:companion_id")
    .delete((req, res) => {
        console.log(`DELETE /companions/favorites/${req.params.companion_id}`);
        res.status(501).send();
    });

module.exports = router;