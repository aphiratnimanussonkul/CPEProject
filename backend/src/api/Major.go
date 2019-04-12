package api

import (
"fmt"
	"github.com/gorilla/mux"
"net/http"
"CPEProject/src/models"
"CPEProject/config"
"CPEProject/src/repository"
)


func AddMajor(w http.ResponseWriter, req *http.Request)  {
	//
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	majorRepository := repository.NewMajorRepository(db, "Major")
	facultyRepository := repository.NewFacultyRepositoryMongo(db, "Faculty")

	params := mux.Vars(req)
	var facultyName string
	facultyName = string(params["facultyName"])
	faculty, err2 := facultyRepository.FindByName(facultyName)
	if err2 != nil {
		fmt.Println(err)
	}
	var name string
	name = string(params["name"])

	var p models.Major
	p.Name = name
	p.Faculty = faculty
	majorRepository.Save(&p)

}


//Default data Major
func AddMajorDefault(majorName string, facultyname string)  {
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	majorRepository := repository.NewMajorRepository(db, "Major")
	facultyRepository := repository.NewFacultyRepositoryMongo(db, "Faculty")

	faculty, err2 := facultyRepository.FindByName(facultyname)
	if err2 != nil {
		fmt.Println(err)
	}
	var p models.Major
	p.Name = majorName
	p.Faculty = faculty
	majorRepository.Save(&p)
}