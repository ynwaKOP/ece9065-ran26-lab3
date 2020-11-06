const express = require('express');
const app = express();

app.use(express.json());

const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = lowdb(new FileSync('db.json'));
const db = lowdb(adapter);

const data = require('./Lab3-timetable-data.json');

const courses = [];
// replace 5 with the real data length
for (i = 0; i < 5; i++) {
    let cur = {
        subject: data[i].subject,
        code: data[i].catalog_nbr,
        name: data[i].className,
        component: data[i].course_info[0].ssr_component,
        //info: data[i].course_info, 
    };

    courses.push(cur);

}


app.get('/courses', (req, res) => {
    const classes = [];
    for (i = 0; i < 5; i++) {
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
        for (i = 0; i < 5; i++) {
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
                for (i = 0; i < 5; i++) {
                    if (courses[i].subject == sub && courses[i].code == code && courses[i].component == comp) {
                        classes.push(data[i]);
                    }
                }
            }
            else {
                console.log('sub + code');
                for (i = 0; i < 5; i++) {
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
    const newName = req.body.name;
    if (db.has(newName).value()) {
        return res.status(404).send("already exist");
    }
    else {
        db.set(newName, []).write();
    }
    return res.json(req.body);
});


// save a list of courses in to the schedule
app.post('/schedules/:name', (req, res) => {
    const nm = req.params.name;
    const subs = req.body.subject;
    const codes = req.body.code;
    if (!db.has(nm).value()) {
        return res.status(404).send("schedule does not exist");
    }
    else {
        for (i = 0; i < subs.length; i++) {
            db.get(nm)
                .push({
                    subject: subs[i],
                    code: codes[i]
                })
                .write();
        }
        return res.json(req.body);
         //db.get(nm)
        //.find({subject: sub, code: code}).
        //assign({subject: newSub, code: newCode}).write()
    }
    
});





app.listen(3000, () => console.log(courses));