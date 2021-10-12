const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
var CryptoJS = require("crypto-js");

router.get('/', (req, res) => {
    res.render("employee/addOrEdit", {
        viewTitle: "Insert Employee"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var employee = new Employee();
    employee.fullName = CryptoJS.AES.encrypt(req.body.fullName, 'secret key 123').toString();
    employee.email = req.body.email;
    employee.mobile = CryptoJS.AES.encrypt(req.body.mobile, 'secret key 123').toString();
    employee.city = CryptoJS.AES.encrypt(req.body.city, 'secret key 123').toString();

    employee.save((err, doc) => {
        if (!err)
            res.redirect('employee/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: "Insert Employee",
                    employee: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    req.body.fullName= CryptoJS.AES.encrypt(req.body.fullName, 'secret key 123').toString();
    req.body.mobile= CryptoJS.AES.encrypt(req.body.mobile, 'secret key 123').toString();
    req.body.city= CryptoJS.AES.encrypt(req.body.city, 'secret key 123').toString();

    Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('employee/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: 'Update Employee',
                    employee: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Employee.find((err, docs) => {
        if (!err) {
            console.log ("\n********** Database Contents: **************\n", docs);
            docs.forEach((docs) => {
                docs.fullName= CryptoJS.AES.decrypt(docs.fullName, 'secret key 123').toString(CryptoJS.enc.Utf8);
                docs.mobile= CryptoJS.AES.decrypt(docs.mobile, 'secret key 123').toString(CryptoJS.enc.Utf8);
                docs.city= CryptoJS.AES.decrypt(docs.city, 'secret key 123').toString(CryptoJS.enc.Utf8);
            });
            res.render("employee/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if (!err) {
            doc.fullName= CryptoJS.AES.decrypt(doc.fullName, 'secret key 123').toString(CryptoJS.enc.Utf8);
            doc.mobile= CryptoJS.AES.decrypt(doc.mobile, 'secret key 123').toString(CryptoJS.enc.Utf8);
            doc.city= CryptoJS.AES.decrypt(doc.city, 'secret key 123').toString(CryptoJS.enc.Utf8);
            
            res.render("employee/addOrEdit", {
                viewTitle: "Update Employee",
                employee: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/employee/list');
        }
        else { console.log('Error in employee delete :' + err); }
    });
});

module.exports = router;