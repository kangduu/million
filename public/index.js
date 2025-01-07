(function () {
  const store = new Map();

  // 为更新按钮添加点击事件
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

  // 获取验证码
  function getCaptcha(e) {
    const captchaImg = e.target;
    fetch(`http://localhost:9000/api/v1/user/captcha`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ code, data }) => {
        if (code === 200) {
          const base64Data = btoa(data.img);
          const url = `data:image/svg+xml;base64,${base64Data}`;
          captchaImg.src = url;
          store.set("captchaId", data.id);
        }
      });
  }

  // 获取表单数据
  function getFormData(form) {
    const username = (document.getElementById("username").value || "").trim();
    const password = (document.getElementById("password").value || "").trim();
    const captcha = (document.getElementById("captcha").value || "").trim();
    return { username, password, captcha };
  }

  // 重置表单
  function resetForm() {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("captcha").value = "";
  }

  // 存储用户数据
  function storeUserData(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("expired_at", data.expired_at);
  }

  // 登录
  function handleLogin(e) {
    e.preventDefault();
    const loginButton = e.target;
    loginButton.disabled = true;
    loginButton.textContent = "登录中...";

    const { username, password, captcha } = getFormData();

    let verified = false,
      tip = "";

    if (!username) {
      verified = true;
      tip = "请输入用户名";
    }
    if (!password && !verified) {
      verified = true;
      tip = "请输入密码";
    }
    if (!captcha && !verified) {
      verified = true;
      tip = "请输入验证码";
    }

    if (verified) {
      alert(tip);
      loginButton.disabled = false;
      loginButton.textContent = "登录";
      return;
    }

    fetch(`http://localhost:9000/api/v1/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        captcha,
        captchaId: store.get("captchaId"),
      }),
    })
      .then((res) => res.json())
      .then(({ code, data, msg }) => {
        if (code === 200) {
          resetForm();
          storeUserData(data);
          hiddenLogin();
          appendUpdateButtonsClick();
          logoutButtonAppendClickEvent();
        } else alert(msg);
      });

    loginButton.disabled = false;
    loginButton.textContent = "登录";
  }

  // 退出登录
  function logout() {
    fetch(`http://localhost:9000/api/v1/user/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then(({ code, msg }) => {
        if (code === 200) {
          localStorage.clear();
          showLogin();
          loginButtonAppendClickEvent();
          captchaImgAppendClickEvent();
        } else alert(msg);
      });
  }

  // 隐藏登录表单
  function hiddenLogin() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("updates").style.display = "block";
    document.getElementById("logout").style.display = "block";
  }

  // 显示登录表单
  function showLogin() {
    document.getElementById("login-form").style.display = "block";
    document.getElementById("updates").style.display = "none";
    document.getElementById("logout").style.display = "none";
  }

  function EnterPress(e) {
    if (e.key === "Enter") handleLogin(e);
  }

  // 为登录按钮添加点击事件
  function loginButtonAppendClickEvent() {
    const loginButton = document.getElementById("login-button");
    loginButton.addEventListener("click", handleLogin, false);

    window.removeEventListener("keydown", EnterPress, false); // 防止重复绑定 EnterPress 事件
    window.addEventListener("keydown", EnterPress, false);
  }

  // 为验证码图片添加点击事件
  function captchaImgAppendClickEvent() {
    const captchaImg = document.getElementById("captcha-img");
    captchaImg.addEventListener("click", getCaptcha, false);
    captchaImg.click();
  }

  // 为退出按钮添加点击事件
  function logoutButtonAppendClickEvent() {
    const logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", logout, false);
  }

  // 初始化
  function init() {
    const token = localStorage.getItem("token");
    if (token) {
      hiddenLogin();
      appendUpdateButtonsClick();
      logoutButtonAppendClickEvent();
    } else {
      showLogin();
      loginButtonAppendClickEvent();
      captchaImgAppendClickEvent();
    }
  }

  init();
})();
