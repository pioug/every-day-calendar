const mainEl = document.querySelector("main");
const today = new Date();
const calendarEl = document.createDocumentFragment();

const dayOne = new Date(new Date().getFullYear(), 0, 1);
let day = new Date(dayOne);
let days = [day];
let months = [day];

while (day.getFullYear() === new Date().getFullYear()) {
  day = new Date(new Date(day).setDate(day.getDate() + 1));
  days.push(day);

  if (day.getMonth() !== months[months.length - 1].getMonth()) {
    months.push(day);
  }
}

days.pop();
months.pop();

localStorage.activeDays = localStorage.activeDays || [];

let monthEl;
const allDays = [...days];
const hash = new Map();

while ((a = days.shift())) {
  if (a === months[a.getMonth()]) {
    monthEl = document.createElement("ul");
    const el = document.createElement("li");
    el.innerText = a.toLocaleString("en-us", { month: "short" });
    monthEl.appendChild(el);
    calendarEl.appendChild(monthEl);
  }

  const el = document.createElement("li");
  el.classList.add("day");
  el.classList.toggle('today', a.getDate() === today.getDate() && a.getMonth() === today.getMonth());
  el.classList.toggle(
    "active",
    localStorage.activeDays[allDays.indexOf(a)] === "1"
  );
  el.innerText = a.getDate();
  monthEl.appendChild(el);
  hash.set(el, { date: a, active: el.classList.contains("active") });
}

mainEl.appendChild(calendarEl);

mainEl.addEventListener("click", event => {
  if (event.target.classList.contains("day")) {
    event.target.classList.toggle("active");
    const { date } = hash.get(event.target);
    hash.set(event.target, {
      date,
      active: event.target.classList.contains("active")
    });
  }

  localStorage.activeDays = encode(hash);
});

function encode(hash) {
  return Array.from(hash).reduce((acc, [, { active }]) => {
    return acc + +active;
  }, "");
}
