package api

import (
	"CPEProject/config"
	"CPEProject/src/models"
	"CPEProject/src/repository"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
)


func AddFaculty(w http.ResponseWriter, req *http.Request)  {

	//
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	facultyRepository := repository.NewFacultyRepositoryMongo(db, "Faculty")
	//

	params := mux.Vars(req)
	var name string
	name = string(params["name"])

	var p models.Faculty
	p.Name = name
	facultyRepository.Save(&p)

}


func GetFacultyById(w http.ResponseWriter, req *http.Request) {

	//
	fmt.Println("Go Mongo Db")
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	facultyRepository := repository.NewFacultyRepositoryMongo(db, "Profile")
	//
	params := mux.Vars(req)
	fmt.Println(params["id"])


	profile, err := facultyRepository.FindByID(params["id"])

	fmt.Println("===== 1 =====")
	fmt.Println(profile)
	fmt.Println("===== 2 =====")
	fmt.Println(profile.ID)


}


//Defualt add data
func AddFacultyDefualt(facultyname string)  {
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	facultyRepository := repository.NewFacultyRepositoryMongo(db, "Faculty")
	var p models.Faculty
	p.Name = facultyname
	facultyRepository.Save(&p)
}