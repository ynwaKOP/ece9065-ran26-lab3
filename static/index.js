
const btt = document.getElementById('list');
function getAll() {
  fetch('http://localhost:3000/courses')
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
  const url = 'http://localhost:3000/courses/' + name;
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
  const url = 'http://localhost:3000/courses/' + name + "/" + code + "/" + comp;
  console.log(url);
  searchCourses(url);
});