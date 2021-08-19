let islaiduTipai = [];
let islaiduTipas = null;
let mokejimuTipai = [];
let mokejimuTipas = null;

function getIslaiduTipai() {
  fetch("/json/islaiduTipai")
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return new Promise((resolve, reject) => {
          res.json()
            .then((errorFromServer) => {
              reject(errorFromServer);
            })
            .catch((err) => {
              reject(err);
            });
        });
      }
    })
    .then((list) => {
      islaiduTipai = list;
      showIslaiduTipai();
    })
    .catch((err) => {
      console.log(err);
      alert("Klaida");
    });
}

function showIslaiduTipai() {
  const div = document.getElementById("islaiduTipai");
  cleanNode(div);
  const ul = document.createElement("ul");
  for (const tipas of islaiduTipai) {
    const li = document.createElement("li");
    li.appendChild(
      document.createTextNode(`${tipas.pavadinimas} (${tipas.id})`),
    );
    ul.appendChild(li);
  }
  div.appendChild(ul);
}

async function getIslaiduTipas() {
  const id = document.getElementById("itId").value;
  try {
    const res = await fetch("/json/islaiduTipai/" + id);
    if (res.ok) {
      const tipas = await res.json();
      islaiduTipas = tipas;
      showIslaiduTipas();
    } else {
      throw await res.json();
    }
  } catch (err) {
    console.log(err);
    alert("Klaida");
  }
}

function showIslaiduTipas() {
  const inputId = document.getElementById("itId");
  const inputPav = document.getElementById("itPavadinimas");
  if (islaiduTipas) {
    inputId.value = islaiduTipas.id;
    inputPav.value = islaiduTipas.pavadinimas;
  } else {
    inputId.value = "";
    inputPav.value = "";
  }
}

async function addIslaiduTipas() {
  const pavadinimas = document.getElementById("itPavadinimas").value;
  try {
    const res = await fetch("/json/islaiduTipai/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pavadinimas,
      }),
    });
    if (res.ok) {
      const tipas = await res.json();
      islaiduTipas = tipas;
      showIslaiduTipas();
    } else {
      throw await res.json();
    }
  } catch (err) {
    console.log(err);
    alert("Klaida");
  }
}

async function editIslaiduTipas() {
  const id = document.getElementById("itId").value;
  const pavadinimas = document.getElementById("itPavadinimas").value;
  try {
    const res = await fetch("/json/islaiduTipai/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pavadinimas,
      }),
    });
    if (res.ok) {
      const tipas = await res.json();
      islaiduTipas = tipas;
      showIslaiduTipas();
    } else {
      throw await res.json();
    }
  } catch (err) {
    console.log(err);
    alert("Klaida");
  }
}

async function deleteIslaiduTipas() {
  const id = document.getElementById("itId").value;
  try {
    const res = await fetch("/json/islaiduTipai/" + id, {
      method: "DELETE",
    });
    if (res.ok) {
      const tipas = await res.json();
      islaiduTipas = tipas;
      showIslaiduTipas();
    } else {
      throw await res.json();
    }
  } catch (err) {
    console.log(err);
    alert("Klaida");
  }
}
//////////////////////

function getMokejimuTipai() {
  fetch("/json/mokejimuTipai")
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return new Promise((resolve, reject) => {
          res.json()
            .then((errorFromServer) => {
              reject(errorFromServer);
            })
            .catch((err) => {
              reject(err);
            });
        });
      }
    })
    .then((list) => {
      mokejimuTipai = list;
      showMokejimuTipai();
    })
    .catch((err) => {
      console.log(err);
      alert("Klaida");
    });
}

function showMokejimuTipai() {
  const div = document.getElementById("mokejimuTipai");
  cleanNode(div);
  const ul = document.createElement("ul");
  for (const tipas of mokejimuTipai) {
    const li = document.createElement("li");
    li.appendChild(
      document.createTextNode(`${tipas.pavadinimas} (${tipas.id})`),
    );
    ul.appendChild(li);
  }
  div.appendChild(ul);
}

async function getMokejimuTipas() {
  const id = document.getElementById("mtId").value;
  try {
    const res = await fetch("/json/mokejimuTipai/" + id);
    if (res.ok) {
      const tipas = await res.json();
      mokejimuTipas = tipas;
      showMokejimuTipas();
    } else {
      throw await res.json();
    }
  } catch (err) {
    console.log(err);
    alert("Klaida");
  }
}

function showMokejimuTipas() {
  const inputId = document.getElementById("mtId");
  const inputPav = document.getElementById("mtPavadinimas");
  if (mokejimuTipas) {
    inputId.value = mokejimuTipas.id;
    inputPav.value = mokejimuTipas.pavadinimas;
  } else {
    inputId.value = "";
    inputPav.value = "";
  }
}

async function addMokejimuTipas() {
  const pavadinimas = document.getElementById("mtPavadinimas").value;
  try {
    const res = await fetch("/json/mokejimuTipai/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pavadinimas,
      }),
    });
    if (res.ok) {
      const tipas = await res.json();
      mokejimuTipas = tipas;
      showMokejimuTipas();
    } else {
      throw await res.json();
    }
  } catch (err) {
    console.log(err);
    alert("Klaida");
  }
}

async function editMokejimuTipas() {
  const id = document.getElementById("mtId").value;
  const pavadinimas = document.getElementById("mtPavadinimas").value;
  try {
    const res = await fetch("/json/mokejimuTipai/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pavadinimas,
      }),
    });
    if (res.ok) {
      const tipas = await res.json();
      mokejimuTipas = tipas;
      showMokejimuTipas();
    } else {
      throw await res.json();
    }
  } catch (err) {
    console.log(err);
    alert("Klaida");
  }
}

async function deleteMokejimuTipas() {
  const id = document.getElementById("mtId").value;
  try {
    const res = await fetch("/json/mokejimuTipai/" + id, {
      method: "DELETE",
    });
    if (res.ok) {
      const tipas = await res.json();
      mokejimuTipas = tipas;
      showMokejimuTipas();
    } else {
      throw await res.json();
    }
  } catch (err) {
    console.log(err);
    alert("Klaida");
  }
}

async function deletePreke() {
  const cekisId = document.getElementById("cekisId").value;
  const prekeId = document.getElementById("prekeId").value;
  try {
    const res = await fetch("/json/cekiai/" + cekisId + "/prekes/" + prekeId, {
      method: "DELETE",
    });
    if (res.ok) {
      const preke = await res.json();
      console.log("Istrynem", preke);
    } else {
      throw await res.json();
    }
  } catch (err) {
    console.log(err);
    alert("Klaida");
  }
}

function cleanNode(node) {
  if (node) {
    while (node.firstChild) {
      node.firstChild.remove();
    }
  }
}
