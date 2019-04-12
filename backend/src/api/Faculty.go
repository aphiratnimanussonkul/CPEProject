package api

import (
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
	"CPEProject/src/models"
	"CPEProject/config"
	"CPEProject/src/repository"
)


func AddFaculty(w http.ResponseWriter, req *http.Request)  {

	//
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	profileRepository := repository.NewProfileRepositoryMongo(db, "Faculty")
	//

	params := mux.Vars(req)
	var majorName string
	majorName = string(params["majorName"])
	MajorRepository := repository.NewMajorRepository(db, "Major")
	major, err2 := MajorRepository.FindByName(majorName)
	if err2 != nil {
		fmt.Println(err)
	}
	//get variable by path

	var name string
	name = string(params["name"])

	var p models.Faculty
	p.Name = name
	p.Major = major
	profileRepository.Save(&p)

}

func GetFacultyById(w http.ResponseWriter, req *http.Request) {

	//
	fmt.Println("Go Mongo Db")
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	profileRepository := repository.NewProfileRepositoryMongo(db, "Profile")
	//
	params := mux.Vars(req)
	fmt.Println(params["id"])


	profile, err := profileRepository.FindByID(params["id"])

	fmt.Println("===== 1 =====")
	fmt.Println(profile)
	fmt.Println("===== 2 =====")
	fmt.Println(profile.ID)


}


//Defualt add data
func AddFacultyDefualt(facultyname string, majorName string)  {
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	profileRepository := repository.NewProfileRepositoryMongo(db, "Faculty")
	MajorRepository := repository.NewMajorRepository(db, "Major")
	major, err2 := MajorRepository.FindByName(majorName)
	if err2 != nil {
		fmt.Println(err)
	}
	var p models.Faculty
	p.Name = facultyname
	p.Major = major
	profileRepository.Save(&p)
}