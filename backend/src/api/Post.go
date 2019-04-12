package api

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
	"CPEProject/src/models"
	"CPEProject/config"
	"CPEProject/src/repository"
	"time"
)


func AddPost(w http.ResponseWriter, req *http.Request)  {
	//
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	postRepository := repository.NewPostRepository(db, "Post")
	userRepository := repository.NewUserRepository(db, "User")
	currentTime := time.Now()
	//get variable by path
	params := mux.Vars(req)
	var email = string(params["email"])
	user, err2 := userRepository.FindByEmail(email)
	if err2 != nil {
		fmt.Println(err2)
	}
	var text string
	text = string(params["text"])

	var p models.Post
	p.Text = text
	p.Timestamp = currentTime.Format("3:4:5")
	p.Date = currentTime.Format("2006-01-02")
	p.User = user
	postRepository.Save(&p)

}


func GetPostAll(w http.ResponseWriter, req *http.Request)  {
	//
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	postRepository := repository.NewPostRepository(db, "Post")
	post, err2 := postRepository.FindAll()
	if err2 != nil {
		fmt.Println(err2)
	}
	json.NewEncoder(w).Encode(post)


}

//Default data Major
