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
	//

	//get variable by path
	params := mux.Vars(req)
	var name,subjectname string
	name = string(params["name"])
	subjectname = string(params["sunjectname"])

	subjectRepository := repository.NewSubjectRepository(db, "Subject")
	subject, err2 := subjectRepository.FindByName(subjectname)
	if err2 != nil {
		fmt.Println(err)
	}

	var p models.Major
	p.Name = name
	p.Subject = subject
	majorRepository.Save(&p)

}


//Default data Major
func AddMajorDefault(majorName string, subjectName string)  {
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	majorRepository := repository.NewMajorRepository(db, "Major")
	subjectRepository := repository.NewSubjectRepository(db, "Subject")
	subject, err2 := subjectRepository.FindByName(subjectName)
	if err2 != nil {
		fmt.Println(err)
	}
	var p models.Major
	p.Name = majorName
	p.Subject = subject
	majorRepository.Save(&p)
}