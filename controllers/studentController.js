const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Student = mongoose.model('Student');
var CryptoJS = require("crypto-js");

router.get('/', (req, res) => {
    res.render("student/addOrEdit", {
        viewTitle: "Insert Student"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var student = new Student();
    // student.fullName = req.body.fullName;
    // student.regno = req.body.regno;
    // student.branch = req.body.branch;
    // student.city = req.body.city;
    student.fullName = CryptoJS.AES.encrypt(req.body.fullName, 'info sec 21').toString();
    student.regno = CryptoJS.AES.encrypt(req.body.regno, 'info sec 21').toString();
    student.branch = CryptoJS.AES.encrypt(req.body.branch, 'info sec 21').toString();
    student.city = CryptoJS.AES.encrypt(req.body.city, 'info sec 21').toString();

    student.save((err, doc) => {
        if (!err)
            res.redirect('student/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("student/addOrEdit", {
                    viewTitle: "Insert Student",
                    student: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    req.body.fullName = CryptoJS.AES.encrypt(req.body.fullName, 'info sec 21').toString();
    req.body.regno = CryptoJS.AES.encrypt(req.body.regno, 'info sec 21').toString();
    req.body.branch = CryptoJS.AES.encrypt(req.body.branch, 'info sec 21').toString();
    req.body.city = CryptoJS.AES.encrypt(req.body.city, 'info sec 21').toString();

    Student.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('student/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("student/addOrEdit", {
                    viewTitle: 'Update Student',
                    student: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Student.find((err, docs) => {
        if (!err) {
            console.log("\n**** Database Contents: ******\n", docs);
            docs.forEach((docs) => {
                docs.fullName = CryptoJS.AES.decrypt(docs.fullName, 'info sec 21').toString(CryptoJS.enc.Utf8);
                docs.regno = CryptoJS.AES.decrypt(docs.regno, 'info sec 21').toString(CryptoJS.enc.Utf8);
                docs.branch = CryptoJS.AES.decrypt(docs.branch, 'info sec 21').toString(CryptoJS.enc.Utf8);
                docs.city = CryptoJS.AES.decrypt(docs.city, 'info sec 21').toString(CryptoJS.enc.Utf8);
            });
            res.render("student/list", {
                list: docs
            });
            // res.render("employee/list", {
            //     list: docs
            // });
        }
        else {
            console.log('Error in retrieving student list :' + err);
        }
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Student.findById(req.params.id, (err, doc) => {
        if (!err) {
            doc.fullName = CryptoJS.AES.decrypt(doc.fullName, 'info sec 21').toString(CryptoJS.enc.Utf8);
            doc.regno = CryptoJS.AES.decrypt(doc.regno, 'info sec 21').toString(CryptoJS.enc.Utf8);
            doc.branch = CryptoJS.AES.decrypt(doc.branch, 'info sec 21').toString(CryptoJS.enc.Utf8);
            doc.city = CryptoJS.AES.decrypt(doc.city, 'info sec 21').toString(CryptoJS.enc.Utf8);
            
            res.render("student/addOrEdit", {
                viewTitle: "Update Student",
                student: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Student.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/student/list');
        }
        else { console.log('Error in student delete :' + err); }
    });
});

module.exports = router;