
const awsurl = 'ec2-52-90-188-253.compute-1.amazonaws.com:3000/'
// get all courses
const btt = document.getElementById('list');

function getAll() {
  fetch(awsurl + 'courses')
  .then(res => res.json())
  .then(json => {
    json.forEach(item => {
      showResult(`${item.subject} - ${item.name}`)
    });
  });
}


btt.addEventListener('click', function() {
  getAll();
});

// search subject return code
const go1 = document.getElementById("go1");
const sub1 = document.getElementById("sub1");
function getCourses(url) {
  fetch(url)
  .then(res => res.json())
  .then(json => {
    json.forEach(item => {
      showResult(item.course_code);
      
    });
  });
}


go1.addEventListener('click', function() {
  var name = sub1.value;
  const url = awsurl+ 'courses/' + name;
  console.log(url);
  getCourses(url);
});

// search combo
const go2 = document.getElementById("go2");
const sub2 = document.getElementById("sub2");
const code1 = document.getElementById("code1");
const comp1 = document.getElementById("comp1");

function searchCourses(url) {
  fetch(url)
  .then(res => res.json())
  .then(json => {
    json.forEach(item => {
      showResult(JSON.stringify(item));
    });
  });
}


go2.addEventListener('click', function() {
  var name = sub2.value;
  var code = code1.value;
  var comp = comp1.value;
  
  const url = awsurl + 'courses/' + name + "/" + code + "/" + comp;
  console.log(url);
  searchCourses(url);
});


const newName = document.getElementById("newName");
const bAdd = document.getElementById("add");

bAdd.addEventListener('click', function() {
  var jsObj = { name:newName.value};
  const url = awsurl + 'schedules';
  console.log(url);
  addSche(url, jsObj);
});


function addSche(url, jsObj) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jsObj),
  })
  .then(response => response.json());
};




const scheName = document.getElementById("scheName");
const bSearchSche = document.getElementById("searchSche");

function searchSchedule(url) {
  fetch(url)
  .then(res => res.json())
  .then(json => {
    json.forEach(item => {
      showResult(`${item.subject} ${item.code}`);
    });
  });
}


bSearchSche.addEventListener('click', function() {
  var name = scheName.value;
  const url = awsurl + 'schedules/' + name;
  console.log(url);
  searchSchedule(url);
});



const bALLSchedules = document.getElementById("allSchedules");
function showSchedules(url) {
  fetch(url)
  .then(res => res.json())
  .then(json => {
    json.forEach(item => {
      showResult(`${item.name} -- ${item.numberOfCourses} courses`);
    });
  });
}


bALLSchedules.addEventListener('click', function() {
  const url = awsurl + 'schedulelist';
  console.log(url);
  showSchedules(url)
});


// add courses into the schedule

const curSche = document.getElementById("curSche");
const addSub = document.getElementById("addSubs");
const addCode = document.getElementById("addCodes");
const bAddCourse = document.getElementById("addCourse");
const bReplace = document.getElementById("updateCourse");

bAddCourse.addEventListener('click', function() {
  var name = curSche.value;
  var sub = addSub.value.split(",");
  var cd = addCode.value.split(",");
  var jsObj = {subject: sub,  code: cd};
  const url = awsurl + 'schedules/' + name;
  console.log(url);
  addCourse(url, jsObj);
});

function addCourse(url, jsObj) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jsObj),
  })
  .then(response => response.json());
};

bReplace.addEventListener('click', function() {
  var name = curSche.value;
  var sub = addSub.value.split(",");
  var cd = addCode.value.split(",");
  var jsObj = {subject: sub,  code: cd};
  const url = awsurl + 'schedules/' + name;
  console.log(url);
  addCourse(url, jsObj);
});


function replaceCourse(url, jsObj) {
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jsObj),
  })
  .then(response => response.json());
};



/*
<label>Schedule Name</label>
        <input id="deleteName" type="text">
        <button id="deleteSche" type="text"> Delete THE SCHEDULE</button>
*/
const deleteName = document.getElementById("deleteName");
const bDeleteSche = document.getElementById("deleteSche");

function deleteSche(url) {
  return fetch(url, {
    method: 'DELETE',
  })
  .then(response => response.json());
};

bDeleteSche.addEventListener('click', function() {
  var name = deleteName.value;
  const url = awsurl + 'schedules/' + name;
  console.log(url);
  deleteSche(url);
});


const bdeleteAllSche = document.getElementById("deleteAllSche");
function deleteAllSche(url) {
  return fetch(url, {
    method: 'DELETE',
  })
  .then(response => response.json());
};

bdeleteAllSche.addEventListener('click', function() {
  const url = awsurl + 'schedulelist'
  console.log(url);
  deleteAllSche(url);
});

function showResult(content) {
  const container = document.getElementById("show");
  const element = document.createElement('p');
  element.textContent = content;
  container.appendChild(element);
}
