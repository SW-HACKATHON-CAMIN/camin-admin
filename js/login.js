let REST_API_KEY = "ca8c40745e8e48038322e1f00094dee0";
let JAVASCRIPT_KEY = "4a307bf7d0df4bfe8f341b351e753e52";
let SECRET_KEY = "niLrfRkskPgHrp9JX7iSlWePQYhwLOog";
let redirectUrl = location.protocol + '//' + location.host + "/camin-admin/kakao/auth.html";

function initializeKakao() {
    Kakao.init(JAVASCRIPT_KEY);
    Kakao.isInitialized();
}

function moveKakaoLogin() {
    let kakaoAuthUrl = "https://kauth.kakao.com/oauth/authorize";
    location.href = kakaoAuthUrl + "?client_id=" + REST_API_KEY + "&redirect_uri=" + redirectUrl + "&response_type=code";
}

function getKakaoToken(code) {
    let data = {
        "grant_type": "authorization_code",
        "client_id": REST_API_KEY,
        "redirect_uri": redirectUrl,
        "client_secret": SECRET_KEY,
        "code": code,
    };

    $.ajax("https://kauth.kakao.com/oauth/token", {
        data: data,
        dataType: "json",
        method: "POST",
        async: false,
        success: function (resultData) {
            location.href = location.protocol + '//' + location.host + "/camin-admin/kakao/token.html?token=" + resultData.access_token;
        }
    });
}

function getKakaoIdByToken(token) {
    initializeKakao();

    Kakao.Auth.setAccessToken(token);
    Kakao.API.request({
        url: "/v2/user/me",
        success: function (response) {
            if (isAdmin(response.id)) {
                location.href = "../index.html";
            } else {
                location.href = "../error.html";
            }
        },
    });
}

function isAdmin(kakaoId) {
    let isAdmin = false;
    let data = {
        "kakaoId": kakaoId
    };

    $.ajax("http://118.67.133.82:8080/api/auth/login", {
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        method: "POST",
        async: false,
        success: function (resultData) {
            isAdmin = resultData.admin;
        }
    });

    return isAdmin;
}