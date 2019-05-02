package api

import (
	"CPEProject/config"
	"CPEProject/src/models"
	"CPEProject/src/repository"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
)


func AddChip(w http.ResponseWriter, req *http.Request)  {

	//
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	chipRepository := repository.NewChipRepositorry(db, "Chip")
	//

	params := mux.Vars(req)
	var name string
	name = string(params["name"])

	var p models.Chip
	p.Name = name
	chipRepository.Save(&p)
}


func GetChipId(w http.ResponseWriter, req *http.Request) {

	//
	fmt.Println("Go Mongo Db")
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	chipRepository := repository.NewChipRepositorry(db, "Chip")
	//
	params := mux.Vars(req)
	fmt.Println(params["id"])


	chip, err := chipRepository.FindByID(params["id"])

	fmt.Println("===== 1 =====")
	fmt.Println(chip)
	fmt.Println("===== 2 =====")
	fmt.Println(chip.ID)


}

func GetChipAll(w http.ResponseWriter, req *http.Request) {

	//
	fmt.Println("Go Mongo Db")
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	chipRepository := repository.NewChipRepositorry(db, "Chip")
	post, err2 := chipRepository.FindAll()
	if err2 != nil {
		fmt.Println(err2)
	}
	json.NewEncoder(w).Encode(post)
}

//Defualt add data
func AddChipDefualt(chipname string)  {
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	chipRepository := repository.NewChipRepositorry(db, "Chip")
	var p models.Chip
	p.Name = chipname
	chipRepository.Save(&p)
}