package api

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
	"CPEProject/src/models"
	"CPEProject/config"
	"CPEProject/src/repository"
)


func AddUser(w http.ResponseWriter, req *http.Request)  {
	//
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	userRepository := repository.NewUserRepository(db, "User")

	//get variable by path
	params := mux.Vars(req)
	var firstName, lastName, Email string
	firstName = string(params["firstName"])
	lastName = string(params["lastName"])
	Email = string(params["Email"])


	var p models.User
	p.Firstname = firstName
	p.Lastname = lastName
	p.Email = Email
	userRepository.Save(&p)

}

func GetUserByEmail(w http.ResponseWriter, req *http.Request)  {
	//
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	userRepository := repository.NewUserRepository(db, "User")

	//get variable by path
	params := mux.Vars(req)
	var Email string
	Email = string(params["Email"])

	user, err2 := userRepository.FindByEmail(Email)
	if err2 != nil{
		fmt.Println(err2)
	}
	json.NewEncoder(w).Encode(user)

}


//Default data Major
