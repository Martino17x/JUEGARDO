const userNameText = document.querySelector(".userName")
const userScoreText = document.querySelector(".userScore")

const saveNameButton = document.querySelector(".saveNameBtn")
const saveAgeButton = document.querySelector(".saveAgeBtn")
const score = {
    "userName":"", 
    "userScore":""
}


saveNameButton.addEventListener("click", () => {
    const userName = document.querySelector(".name").value
    userNameText.textContent = userName
    localStorage.setItem("name", userName)
    score.userName = userName
    score.userScore = 0
    localStorage.setItem("score", score)
    console.log(localStorage.getItem("score.userName"))
  })

  function displayUserName () {
    const nameFromLocalStorage = localStorage.getItem("name")
  
    if (nameFromLocalStorage) {
      userNameText.textContent = nameFromLocalStorage
    } else {
      userNameText.textContent = "No name data in local storage"
    }
  }
  
  displayUserName()




  