// ===============================
// PEOPLEFLOW - EMPLOYEE MANAGEMENT
// ===============================

// ---------- Default Employees ----------

const defaults = [
  [
    "Olivia Rhye",
    "olivia@acme.com",
    "Design",
    "Product Designer",
    "Active",
    "Jan 12, 2023",
    "OR",
    "a1"
  ],
  [
    "Phoenix Baker",
    "phoenix@acme.com",
    "Engineering",
    "Frontend Engineer",
    "Active",
    "Feb 03, 2023",
    "PB",
    "a2"
  ],
  [
    "Lana Steiner",
    "lana@acme.com",
    "Marketing",
    "Content Strategist",
    "On leave",
    "Mar 15, 2023",
    "LS",
    "a3"
  ],
  [
    "Demi Wilkinson",
    "demi@acme.com",
    "Engineering",
    "Backend Engineer",
    "Active",
    "Apr 08, 2023",
    "DW",
    "a4"
  ],
  [
    "Candice Wu",
    "candice@acme.com",
    "Operations",
    "Operations Manager",
    "Active",
    "Apr 21, 2023",
    "CW",
    "a5"
  ],
  [
    "Natali Craig",
    "natali@acme.com",
    "Design",
    "UX Researcher",
    "Active",
    "May 03, 2023",
    "NC",
    "a6"
  ],
  [
    "Drew Cano",
    "drew@acme.com",
    "Marketing",
    "Marketing Manager",
    "On leave",
    "May 19, 2023",
    "DC",
    "a7"
  ],
  [
    "Orlando Diggs",
    "orlando@acme.com",
    "Engineering",
    "DevOps Engineer",
    "Active",
    "Jun 01, 2023",
    "OD",
    "a8"
  ]
];


// ---------- Application State ----------

let employees =
  JSON.parse(localStorage.getItem("peopleflow-employees")) || defaults;

let currentFilter = "All";
let sorted = false;
let editingIndex = null;


// ---------- DOM Elements ----------

const rows = document.querySelector("#employeeRows");
const overlay = document.querySelector("#overlay");
const details = document.querySelector("#details");
const detailContent = document.querySelector("#detailContent");

const modal = document.querySelector("#modal");
const employeeForm = document.querySelector("#employeeForm");

const searchInput = document.querySelector("#searchInput");
const filterBtn = document.querySelector("#filterBtn");
const filterMenu = document.querySelector("#filterMenu");
const sortBtn = document.querySelector("#sortBtn");

const selectAll = document.querySelector("#selectAll");

const addBtn = document.querySelector("#addBtn");
const closeDetails = document.querySelector("#closeDetails");

const closeModal = document.querySelector("#closeModal");
const cancelModal = document.querySelector("#cancelModal");

const totalElement = document.querySelector("#total");
const showingElement = document.querySelector("#showing");


// ---------- Avatar Colors ----------

const colors = [
  "a1",
  "a2",
  "a3",
  "a4",
  "a5",
  "a6",
  "a7",
  "a8"
];


// ===============================
// LOCAL STORAGE
// ===============================

function saveEmployees() {
  localStorage.setItem(
    "peopleflow-employees",
    JSON.stringify(employees)
  );
}


// ===============================
// TOAST MESSAGE
// ===============================

function showToast(message, type = "success") {
  const toast = document.createElement("div");

  toast.className = `toast ${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2500);
}


// ===============================
// UPDATE STATISTICS
// ===============================

function updateStats() {
  const total = employees.length;

  const onLeave = employees.filter(
    employee => employee[4] === "On leave"
  ).length;

  // Current project does not store remote status,
  // so this remains a visual dashboard value.
  const remote = Math.min(
    9,
    employees.filter(employee => employee[2] === "Engineering").length
  );

  const totalStat = document.querySelector(
    ".stats article:nth-child(1) strong"
  );

  const leaveStat = document.querySelector(
    ".stats article:nth-child(2) strong"
  );

  const remoteStat = document.querySelector(
    ".stats article:nth-child(3) strong"
  );

  if (totalStat) totalStat.textContent = total;
  if (leaveStat) leaveStat.textContent = onLeave;
  if (remoteStat) remoteStat.textContent = remote;
}


// ===============================
// EMPTY STATE
// ===============================

function showEmptyState() {
  rows.innerHTML = `
    <tr>
      <td colspan="7" class="empty-state">
        <div class="empty-icon">⌕</div>
        <strong>No employees found.</strong>
        <p>Try changing your search or filter.</p>
      </td>
    </tr>
  `;
}


// ===============================
// RENDER EMPLOYEES
// ===============================

function render() {
  let list = employees.filter(employee => {
    return (
      currentFilter === "All" ||
      employee[2] === currentFilter
    );
  });

  // Sorting
  if (sorted) {
    list = [...list].sort((a, b) =>
      a[0].localeCompare(b[0])
    );
  }

  // Search
  const searchValue = searchInput.value
    .trim()
    .toLowerCase();

  if (searchValue) {
    list = list.filter(employee => {
      return employee.join(" ").toLowerCase().includes(searchValue);
    });
  }

  // Empty state
  if (list.length === 0) {
    showEmptyState();
  } else {
    rows.innerHTML = list
      .map(employee => {
        const index = employees.indexOf(employee);

        return `
          <tr data-index="${index}">

            <td>
              <input
                type="checkbox"
                aria-label="Select ${employee[0]}"
              >
            </td>

            <td>
              <div class="employee">

                <span class="avatar ${employee[7]}">
                  ${employee[6]}
                </span>

                <div>
                  ${employee[0]}
                  <small>${employee[1]}</small>
                </div>

              </div>
            </td>

            <td>
              <span class="dept">
                ${employee[2]}
              </span>
            </td>

            <td>
              ${employee[3]}
            </td>

            <td>
              <span class="status ${
                employee[4] === "On leave" ? "leave" : ""
              }">
                ${employee[4]}
              </span>
            </td>

            <td>
              ${employee[5]}
            </td>

            <td>
              <button
                class="more"
                aria-label="Actions for ${employee[0]}"
              >
                •••
              </button>

              <div class="row-actions">

                <button class="edit-action">
                  Edit employee
                </button>

                <button class="delete delete-action">
                  Delete employee
                </button>

              </div>
            </td>

          </tr>
        `;
      })
      .join("");
  }

  showingElement.textContent =
    list.length === 0 ? "0" : `1–${list.length}`;

  totalElement.textContent = employees.length;
  document.querySelector("#employeeCount").textContent = employees.length;

  updateStats();
}


// ===============================
// CLOSE ALL PANELS
// ===============================

function closeAll() {
  details.classList.remove("open");
  modal.classList.remove("open");
  overlay.classList.remove("show");

  document
    .querySelectorAll(".row-actions")
    .forEach(menu => menu.classList.remove("open"));
}


// ===============================
// SHOW EMPLOYEE DETAILS
// ===============================

function showDetails(employee) {

  detailContent.innerHTML = `

    <div class="detail-head">

      <span class="avatar ${employee[7]}">
        ${employee[6]}
      </span>

      <h2>${employee[0]}</h2>

      <p>
        ${employee[3]} · ${employee[2]}
      </p>

    </div>


    <div class="detail-section">

      <h3>CONTACT INFORMATION</h3>

      <div class="info">
        <span>Work email</span>
        <strong>${employee[1]}</strong>
      </div>

      <div class="info">
        <span>Phone</span>
        <strong>+1 (555) 014-2890</strong>
      </div>

      <div class="info">
        <span>Location</span>
        <strong>San Francisco, CA</strong>
      </div>

    </div>


    <div class="detail-section">

      <h3>EMPLOYMENT DETAILS</h3>

      <div class="info">
        <span>Department</span>
        <strong>${employee[2]}</strong>
      </div>

      <div class="info">
        <span>Start date</span>
        <strong>${employee[5]}</strong>
      </div>

      <div class="info">
        <span>Status</span>

        <strong class="status ${
          employee[4] === "On leave" ? "leave" : ""
        }">
          ${employee[4]}
        </strong>

      </div>

    </div>
  `;

  details.classList.add("open");
  overlay.classList.add("show");
}


// ===============================
// OPEN ADD / EDIT MODAL
// ===============================

function openModal(index = null) {

  editingIndex = index;

  const employee =
    index === null ? null : employees[index];

  document.querySelector("#modalTitle").textContent =
    employee ? "Edit employee" : "Add employee";

  document.querySelector("#modalDescription").textContent =
    employee
      ? "Update this employee profile."
      : "Create a new employee profile for your workspace.";

  document.querySelector("#saveEmployee").textContent =
    employee ? "Save changes" : "Create employee";

  document.querySelector("#employeeName").value =
    employee ? employee[0] : "";

  document.querySelector("#employeeEmail").value =
    employee ? employee[1] : "";

  document.querySelector("#employeeDepartment").value =
    employee ? employee[2] : "Engineering";

  document.querySelector("#employeeRole").value =
    employee ? employee[3] : "";

  document.querySelector("#employeeStatus").value =
    employee ? employee[4] : "Active";

  modal.classList.add("open");
  overlay.classList.add("show");
}


// ===============================
// FORM VALIDATION
// ===============================

function validateEmployee(name, email, role) {

  if (!name || !email || !role) {
    showToast(
      "Please fill in all required fields.",
      "error"
    );

    return false;
  }

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    showToast(
      "Please enter a valid email address.",
      "error"
    );

    return false;
  }

  const duplicate = employees.some(
    (employee, index) => {

      if (index === editingIndex) {
        return false;
      }

      return (
        employee[1].toLowerCase() ===
        email.toLowerCase()
      );
    }
  );

  if (duplicate) {
    showToast(
      "An employee with this email already exists.",
      "error"
    );

    return false;
  }

  return true;
}


// ===============================
// TABLE ACTIONS
// ===============================

rows.addEventListener("click", event => {

  const row = event.target.closest("tr");

  if (!row || event.target.type === "checkbox") {
    return;
  }

  const index = Number(row.dataset.index);

  const employee = employees[index];


  // More button
  if (event.target.closest(".more")) {

    document
      .querySelectorAll(".row-actions")
      .forEach(menu => {
        menu.classList.remove("open");
      });

    row
      .querySelector(".row-actions")
      .classList.add("open");

    return;
  }


  // Edit
  if (event.target.closest(".edit-action")) {

    openModal(index);

    return;
  }


  // Delete
  if (event.target.closest(".delete-action")) {

    const confirmDelete =
      window.confirm(
        `Delete ${employee[0]}?`
      );

    if (confirmDelete) {

      employees.splice(index, 1);

      saveEmployees();

      render();

      showToast(
        `${employee[0]} deleted successfully.`,
        "success"
      );
    }

    return;
  }


  // Details
  if (!event.target.closest(".row-actions")) {

    showDetails(employee);
  }
});


// ===============================
// SEARCH
// ===============================

searchInput.addEventListener("input", () => {
  render();
});


// ===============================
// FILTER
// ===============================

filterBtn.addEventListener("click", () => {

  filterMenu.classList.toggle("open");
});


document
  .querySelectorAll("[data-filter]")
  .forEach(button => {

    button.addEventListener("click", () => {

      currentFilter =
        button.dataset.filter;

      filterMenu.classList.remove("open");

      render();
    });
  });


// ===============================
// SORT
// ===============================

sortBtn.addEventListener("click", () => {

  sorted = !sorted;

  render();

  showToast(
    sorted
      ? "Employees sorted A–Z."
      : "Sorting removed.",
    "success"
  );
});


// ===============================
// SELECT ALL
// ===============================

selectAll.addEventListener("change", event => {

  document
    .querySelectorAll(
      "#employeeRows input[type='checkbox']"
    )
    .forEach(checkbox => {
      checkbox.checked =
        event.target.checked;
    });
});


// ===============================
// ADD EMPLOYEE
// ===============================

addBtn.addEventListener("click", () => {

  openModal();
});


// ===============================
// CLOSE BUTTONS
// ===============================

closeDetails.addEventListener(
  "click",
  closeAll
);

closeModal.addEventListener(
  "click",
  closeAll
);

cancelModal.addEventListener(
  "click",
  closeAll
);

overlay.addEventListener(
  "click",
  closeAll
);


// ===============================
// FORM SUBMIT
// ===============================

employeeForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const name =
      document
        .querySelector("#employeeName")
        .value
        .trim();

    const email =
      document
        .querySelector("#employeeEmail")
        .value
        .trim();

    const department =
      document.querySelector(
        "#employeeDepartment"
      ).value;

    const role =
      document
        .querySelector("#employeeRole")
        .value
        .trim();

    const status =
      document.querySelector(
        "#employeeStatus"
      ).value;


    // Validation
    if (
      !validateEmployee(
        name,
        email,
        role
      )
    ) {
      return;
    }


    // Initials
    const initials =
      name
        .split(/\s+/)
        .slice(0, 2)
        .map(word => word[0])
        .join("")
        .toUpperCase();


    // Date
    const date =
      new Date().toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "2-digit",
          year: "numeric"
        }
      );


    // Existing avatar color
    const avatarColor =
      editingIndex !== null
        ? employees[editingIndex][7]
        : colors[
            employees.length % colors.length
          ];


    const record = [
      name,
      email,
      department,
      role,
      status,
      date,
      initials,
      avatarColor
    ];


    // Edit
    if (editingIndex !== null) {

      employees[editingIndex] = record;

      showToast(
        "Employee updated successfully.",
        "success"
      );

    }

    // Add
    else {

      employees.push(record);

      showToast(
        "Employee added successfully.",
        "success"
      );
    }


    saveEmployees();

    render();

    closeAll();

    employeeForm.reset();

    editingIndex = null;
  }
);


// ===============================
// DARK / LIGHT MODE
// ===============================

function createThemeButton() {

  const button =
    document.createElement("button");

  button.className = "theme-toggle";

  button.textContent =
    document.body.classList.contains("dark")
      ? "☀"
      : "☾";

  button.title = "Toggle theme";

  document.body.appendChild(button);


  button.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const dark =
      document.body.classList.contains("dark");

    localStorage.setItem(
      "peopleflow-theme",
      dark ? "dark" : "light"
    );

    button.textContent =
      dark ? "☀" : "☾";
  });
}


// Restore theme
const savedTheme =
  localStorage.getItem(
    "peopleflow-theme"
  );

if (savedTheme === "dark") {
  document.body.classList.add("dark");
}


// Create theme button
createThemeButton();


// ===============================
// CSV EXPORT
// ===============================

function exportCSV() {

  if (employees.length === 0) {

    showToast(
      "There are no employees to export.",
      "error"
    );

    return;
  }


  const headers = [
    "Name",
    "Email",
    "Department",
    "Role",
    "Status",
    "Start Date"
  ];


  const data = employees.map(
    employee => [
      employee[0],
      employee[1],
      employee[2],
      employee[3],
      employee[4],
      employee[5]
    ]
  );


  const csv = [
    headers,
    ...data
  ]
    .map(row =>
      row
        .map(value =>
          `"${String(value).replace(
            /"/g,
            '""'
          )}"`
        )
        .join(",")
    )
    .join("\n");


  const blob =
    new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;"
      }
    );


  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "peopleflow-employees.csv";

  link.click();

  URL.revokeObjectURL(url);


  showToast(
    "Employee data exported successfully.",
    "success"
  );
}


// Create export button
function createExportButton() {

  const button =
    document.createElement("button");

  button.className =
    "secondary export-btn";

  button.textContent =
    "Export CSV";

  button.addEventListener(
    "click",
    exportCSV
  );


  const tools =
    document.querySelector(
      ".table-tools"
    );

  if (tools) {
    tools.appendChild(button);
  }
}


createExportButton();


// ===============================
// INITIAL RENDER
// ===============================

render();