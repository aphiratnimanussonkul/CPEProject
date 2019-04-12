package api

import (
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
	//

	//get variable by path
	params := mux.Vars(req)
	var name string
	var code string
	code = string(params["code"])
	name = string(params["name"])

	var p models.Subject
	p.Name = name
	p.Code = code
	subjectRepository.Save(&p)

}


//Default data Major
func AddSubjectDefault(subjectName string, code string)  {
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	subjectRepository := repository.NewSubjectRepository(db, "Subject")
	var p models.Subject
	p.Name = subjectName
	p.Code = code
	subjectRepository.Save(&p)
}