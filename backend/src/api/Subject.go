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


func AddSubject(w http.ResponseWriter, req *http.Request)  {
	//
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	subjectRepository := repository.NewSubjectRepository(db, "Subject")
	majorRepository := repository.NewMajorRepository(db, "Major")

	//get variable by path
	params := mux.Vars(req)
	var name, code, majorName string
	code = string(params["code"])
	name = string(params["name"])
	majorName = string(params["majorName"])

	major, err2 := majorRepository.FindByName(majorName)
	if err2 != nil {
		fmt.Println(err2)
	}
	var p models.Subject
	p.Name = name
	p.Code = code
	p.Major = major
	subjectRepository.Save(&p)

}


func GetSubjectByMajor(w http.ResponseWriter, req *http.Request)  {
	//
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	subjectRepository := repository.NewSubjectRepository(db, "Subject")
	//get variable by path
	params := mux.Vars(req)
	var majorName = string(params["majorName"])

	subject, err2 := subjectRepository.FindByMajor(majorName)
	if err2 != nil {
		fmt.Println(err2)
	}
	json.NewEncoder(w).Encode(subject)

}

func GetSubjectByCode(w http.ResponseWriter, req *http.Request)  {
	//
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	subjectRepository := repository.NewSubjectRepository(db, "Subject")
	//get variable by path
	params := mux.Vars(req)
	var code = string(params["code"])

	subject, err2 := subjectRepository.FindByCode(code)
	if err2 != nil {
		fmt.Println(err2)
	}
	json.NewEncoder(w).Encode(subject.Name)

}

func GetSubjectAll(w http.ResponseWriter, req *http.Request) {

	//
	fmt.Println("Go Mongo Db")
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	subjectRepository := repository.NewSubjectRepository(db, "Subject")
	post, err2 := subjectRepository.FindAll()
	if err2 != nil {
		fmt.Println(err2)
	}
	json.NewEncoder(w).Encode(post)
}


func GetSubjectByMajorEmail(w http.ResponseWriter, req *http.Request)  {
	//
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}

	userRepository := repository.NewUserRepository(db, "User")
	params := mux.Vars(req)
	var majorName = string(params["major"])
	var email = string(params["email"])

	user, err := userRepository.FindByEmail(email)
	var subjects models.SubjectPointer
	for i := 0; i < len(user.Subject); i++ {
		if user.Subject[i].Major.Name == majorName {
			subjects = append(subjects, user.Subject[i])
		}
	}
	json.NewEncoder(w).Encode(subjects)

}
