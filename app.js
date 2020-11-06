const express = require('express');
const app = express();

//const fetch = require("node-fetch");

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

app.listen(3000, () => console.log(courses));