(function () {
  function appendUpdateButtonsClick(e) {
    function updateLotteryData(type) {
      const token = localStorage.getItem("token");

      fetch(`http://localhost:9000/api/v1/database/latest`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: type === "all" ? undefined : type }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    }

    const updateButtons = document.getElementById("update-buttons");
    updateButtons.addEventListener("click", (e) => {
      const type = e.target.dataset.lotteryType;
      if (type) updateLotteryData(type);
    });
  }

  function login(e) {
    e.preventDefault();
    const loginButton = e.target;
    loginButton.disabled = true;
    loginButton.textContent = "登录中...";

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    console.log(username, password);

    if (!username || !password) {
      loginButton.disabled = false;
      loginButton.textContent = "登录";
      alert("请输入用户名和密码");
      return;
    }

    fetch(`http://localhost:9000/api/v1/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          localStorage.setItem("token", data.data.token);
          appendUpdateButtonsClick();
        }
      });

    loginButton.disabled = false;
    loginButton.textContent = "登录";
  }

  function init() {
    const token = localStorage.getItem("token");
    if (token) {
      appendUpdateButtonsClick();
      document.getElementById("login-form").style.display = "none";
    } else {
      const loginButton = document.getElementById("login-button");
      loginButton.addEventListener("click", login);
    }
  }

  init();
})();
