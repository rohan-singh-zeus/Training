interface Cards{
    title: string,
    subject: string,
    grade: string,
    addition: string,
    info:{
        totalStudents: string,
        duration: string,
    },
    image: string
}

interface Notifications{
    info: string,
    course: string,
    cTime: string
}

interface Announcements{
    author: string,
    desc: string,
    fileInfo: string,
    time: string
}


function toggleClassName(itemCall: string, classToggle: string){
    const item = document.querySelector(`.${itemCall}`)
    item?.classList.toggle(classToggle)
}

document.addEventListener("DOMContentLoaded", function () {
  fetch("index.json").then((response) =>
    response
      .json()
      .then((data) => {
        data.cards.map((d: Cards) => {
          populateCards(d);
        });
        data.announcements.map((d: Announcements)=>{
            populateAnnouncements(d)
        })
        data.notifications.map((d: Notifications)=>{
            populateNotifications(d)
        })
      })
      .catch((error) => console.error("Error fetching JSON data:", error))
  );
});

function populateCards(d: Cards) {
  const ele1 = document.querySelector(".courseItems");
  const card = document.createElement("div");
  card.className = "card";
  const courseItemsMain = document.createElement("div");
  courseItemsMain.className = "courseItemsMain";

  const cimage = document.createElement("div");
  cimage.className = "cimage";
  const imgTag = document.createElement("img");
  imgTag.src = d.image;
  cimage.appendChild(imgTag);

  const cContents = document.createElement("div");
  cContents.className = "cContents";
  const cc1 = document.createElement("p");
  cc1.className = "cc-1";
  cc1.textContent = d.title;
  const cc2 = document.createElement("p");
  cc2.className = "cc-2";
  cc2.innerHTML = `
            ${d.subject} | ${d.grade} <span>${d.addition}</span>
          `;
  const cc3 = document.createElement("p");
  cc3.className = "cc-3";
  cc3.innerHTML = `
            <span>4</span> Units <span>18</span> Lessons <span>24</span> Topics
          `;
  const cc4 = document.createElement("div");
  cc4.className = "cc-4";
  cc4.innerHTML = `
            <select name="course" id="course">
                  <option value="course_name">Course Name</option>
                  <option value="saab">Saab</option>
                  <option value="mercedes">Mercedes</option>
                  <option value="audi">Audi</option>
                </select>
          `;

  const cc5 = document.createElement("p");
  cc5.className = "cc-5";
  cc5.innerText = `
           ${d.info.totalStudents && d.info.totalStudents} students  |  ${
    d.info.duration && d.info.duration
  }
        `;
  cContents.appendChild(cc1);
  cContents.appendChild(cc2);
  cContents.appendChild(cc3);
  cContents.appendChild(cc4);
  d.info && cContents.appendChild(cc5);

  const star = document.createElement("img");
  star.className = "star";
  star.src = "images/favourite.svg";

  courseItemsMain.appendChild(cimage);
  courseItemsMain.appendChild(cContents);
  courseItemsMain.appendChild(star);

  const courseItemsIcons = document.createElement("div");
  courseItemsIcons.className = "courseItemsIcons";
  courseItemsIcons.innerHTML = `
            <button>
              <i class="fa-solid fa-eye fa-xl" style="color: #63e6be"></i>
            </button>
            <button disabled>
              <i
                class="fa-solid fa-calendar-days fa-xl"
                style="color: #63e6be"
              ></i>
            </button>
            <button disabled>
              <i
                class="fa-solid fa-bag-shopping fa-xl"
                style="color: #63e6be"
              ></i>
            </button>
            <button>
              <i
                class="fa-solid fa-chart-simple fa-xl"
                style="color: #63e6be"
              ></i>
            </button>
          `;

  card.appendChild(courseItemsMain);
  card.appendChild(courseItemsIcons);

  ele1?.appendChild(card);
}

function populateAnnouncements(d: Announcements) {
    const ele2 = document.querySelector(".db-list")

    const ashish = document.createElement('div');
    ashish.className = 'ashish'

    const p1 = document.createElement('p')
    p1.className = 'para-1'
    p1.textContent = d.author
    const p2 = document.createElement('p')
    p2.className = 'para-2'
    p2.textContent = d.desc

    const pBottom = document.createElement('div')
    pBottom.className = 'para-bottom'
    const p3 = document.createElement('p')
    p3.className = 'para-3'
    p3.textContent = d.fileInfo
    const p4 = document.createElement('p')
    p4.className = 'para-4'
    p4.textContent = d.time
    pBottom.appendChild(p3)
    pBottom.appendChild(p4)

    ashish.appendChild(p1)
    ashish.appendChild(p2)
    ashish.appendChild(pBottom)

    ele2?.appendChild(ashish)
}

function populateNotifications(d: Notifications) {
    const ele3 = document.querySelector(".db2-list")

    const ashish = document.createElement('div');
    ashish.className = 'ashish'

    const p1 = document.createElement('p')
    p1.className = 'para-1'
    p1.textContent = d.info
    const p2 = document.createElement('p')
    p2.className = 'para-2'
    p2.textContent = d.course
    const p3 = document.createElement('p')
    p3.className = 'para-3'
    p3.textContent = d.cTime

    ashish.appendChild(p1)
    ashish.appendChild(p2)
    ashish.appendChild(p3)

    ele3?.appendChild(ashish)
}
