
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
//app.use(express.static('static'));

const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = lowdb(new FileSync('db.json'));
const db = lowdb(adapter);

/*
db.defaults({})
  .write();*/


const data = require('./Lab3-timetable-data.json');

const courses = [];
for (i = 0; i < data.length; i++) {
    let cur = {
        subject: data[i].subject,
        code: data[i].catalog_nbr,
        name: data[i].className,
        component: data[i].course_info[0].ssr_component,
        //info: data[i].course_info, 
    };

    courses.push(cur);

}

//exports.data = data;
//exports.courses = courses;

//front end
//app.use('/courses', express.static('static'));



// get all subject + code
app.get('/courses', (req, res) => {
    const classes = [];
    for (i = 0; i < courses.length; i++) {
        let temp = {
            subject: courses[i].subject,
            name: courses[i].name,
        }
        classes.push(temp);
    }
    
    return res.json(classes);
    
});


app.get('/courses/:subject', (req, res) => {
    var sub = req.params.subject;
    const codes = [];
    if (sub) {
        for (i = 0; i < courses.length; i++) {
            if (courses[i].subject == sub) {
                codes.push( {
                    course_code : courses[i].code
                });
            }
        }

    }
    if (codes.length > 0) {
        return res.json(codes);
    }
    else {
        return res.status(404).send("no results");
    }
});


app.get('/courses/:subject/:code/:component?', (req, res) => {
    var sub = req.params.subject;
    var code = req.params.code;
    var comp = req.params.component;
    const classes = [];
    if (sub && code) {
            if (comp) {
                console.log('sub+code+comp');
                for (i = 0; i < courses.length; i++) {
                    if (courses[i].subject == sub && courses[i].code == code && courses[i].component == comp) {
                        classes.push(data[i]);
                    }
                }
            }
            else {
                console.log('sub + code');
                for (i = 0; i < courses.length; i++) {
                    if (courses[i].subject == sub && courses[i].code == code) {
                        classes.push(data[i]);
                    }
                }
            }
        }
    
    if (classes.length > 0) {
        return res.json(classes);
    }
    else {
        return res.status(404).send("no results");
    }
    
});




// CRUD schdule

// add new schedule
app.post('/schedules', (req, res) => {
    if (!sanitize(JSON.stringify(req.body))) {
        return res.status(403).send(" invalid data receiving ")
    }
    const newName = req.body.name;

    if (db.has(newName).value()) {
        return res.status(404).send("already exist");
    }
    else {
        db.set(newName, []).write();
    }

    return res.json(req.body);
});


app.post('/schedules/:name', (req, res) => {
    const nm = req.params.name;
    const subs = req.body.subject;
    const codes = req.body.code;
    if (!db.has(nm).value()) {
        return res.status(404).send("schedule does not exist");
    }
    else {
        db.set(nm, []).write();
        for (i = 0; i < subs.length; i++) {
            db.get(nm)
              .push({
                    subject: subs[i],
                    code: codes[i]
                })
                 .write();
        }
        return res.json(req.body);
    }
    
});


// read schedule
app.get('/schedules/:name', (req, res) => {
    const nm = req.params.name;
    if (!db.has(nm).value()) {
        console.log("wrong");
        return res.status(404).send(`no schedule named ${nm}`);
    } 
    else {
        pairs =  db.get(nm).value();
        return res.json(pairs);
    }
});


// make it easy, just reaplce all
app.put('/schedules/:name', (req, res) => {
    
    if (!sanitize(JSON.stringify(req.body))) {
        return res.status(403).send(" invalid data receiving ")
    }
    const nm = req.params.name;
    const subs= req.body.subject;
    const codes = req.body.code;
    
    if (!db.has(nm).value()) {
        return res.status(404).send("schedule does not exist");
    }
    else {
        db.set(nm, []).write();
        for (i = 0; i < subs.length; i++) {
            db.get(nm)
              .push({
                    subject: subs[i],
                    code: codes[i]
                })
                 .write();
        }
        return res.json(req.body);

    }
       
        
    
});


app.delete('/schedules/:name', (req, res) => {
    const nm = req.params.name;
    if (!db.has(nm)) {
        return res.status(404).send(`no schedule named ${nm} found`);
    }
    else {
        const obj = db.get(nm).value();
        db.unset(nm).write();

        return res.json(obj);
        
    }

});


app.get('/schedulelist', (req, res) => {
    const classes = [];

    const allSchedules = require('./db.json');

    for (var sche in allSchedules) {
        classes.push({
            name: sche,
            numberOfCourses: db.get(sche).size()

        });
    }
    
    return res.json(classes);
});

app.delete('/schedulelist', (req, res) => {
    
    const allSchedules = require('./db.json');

    for (var sche in allSchedules) {
        db.unset(sche).write();
    }
    
    return res.json({
        delete: "success"
    });

});

function sanitize(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}



app.listen(PORT, () => console.log("running"));
