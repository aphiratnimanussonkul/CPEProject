package main

import (
	//"fmt"
	//   "time"
	//
	//  "CPEProject/config"
	"CPEProject/src/api"
	"encoding/json"
	"fmt"

	//"CPEProject/src/models"
	//"CPEProject/src/repository"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

func main() {

	//default Faculty and Major
	//api.AddSubjectDefault("Computer Network", 523353)
	//api.AddMajorDefault("Computer Engineering", "Computer Network")
	//api.AddFacultyDefault("Engineering","Computer Engineering")

  	router := mux.NewRouter()
	//test
	router.HandleFunc("/test", test).Methods("GET")
  	//Subject
	router.HandleFunc("/subject/{name}/{code}/{majorName}", api.AddSubject).Methods("GET")
	router.HandleFunc("/subject/{majorName}", api.GetSubjectByMajor).Methods("GET")
  	//Faculty
  	router.HandleFunc("/faculty/{name}", api.AddFaculty).Methods("GET")
	router.HandleFunc("/faculties", api.GetFacultyAll).Methods("GET")

	//Major
  	router.HandleFunc("/major/{name}/{facultyName}", api.AddMajor).Methods("GET")
	router.HandleFunc("/major/{facultyName}", api.GetMajorByFaculty).Methods("GET")
	//User
	router.HandleFunc("/user/{Email}", api.GetUserByEmail).Methods("GET")
	router.HandleFunc("/follow/{email}/{code}", api.FollowSubject).Methods("GET")
	router.HandleFunc("/user/{firstName}/{lastName}/{Email}", api.AddUser).Methods("GET")
	router.HandleFunc("/user/{firstName}/{lastName}/{Email}/{code}", api.AddUserSubject).Methods("GET")
	//Post
	router.HandleFunc("/postvdo/{text}/{email}/{code}/{vdoLink}", api.AddPost).Methods("GET")
	router.HandleFunc("/postfile/{text}/{email}/{code}/{name}/{token}", api.AddPost).Methods("GET")
	router.HandleFunc("/postfull/{text}/{email}/{code}/{vdoLink}/{name}/{token}", api.AddPost).Methods("GET")
	router.HandleFunc("/post/{text}/{email}/{code}", api.AddPost).Methods("POST")
	router.HandleFunc("/post", api.AddPost).Methods("POST")
	router.HandleFunc("/postPic", api.UploadFileChunk)
	router.HandleFunc("/posts", api.GetPostAll).Methods("GET")
	router.HandleFunc("/post/{code}", api.GetPostByCode).Methods("GET")
  	log.Fatal(http.ListenAndServe(":12345", handlers.CORS(handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD"}), handlers.AllowedOrigins([]string{"*"}))(router)))
  
}
func test(w http.ResponseWriter, req *http.Request) {
	//
	body:= req.Body
	fmt.Println(body)
	json.NewEncoder(w).Encode(body)


}


// func updateProfile(profileRepository repository.ProfileRepository) {
//   var p model.Profile
//   p.ID = "U1"
//   p.FirstName = "Wuriyanto"
//   p.LastName = "Musobar"
//   p.Email = "wuriyanto_musobar@gmail.com"
//   p.Password = "12345678"
//   p.CreatedAt = time.Now()
//   p.UpdatedAt = time.Now()

//   err := profileRepository.Update("U1", &p)

//   if err != nil {
//     fmt.Println(err)
//   } else {
//     fmt.Println("Profile updated..")
//   }
// }

// func deleteProfile(profileRepository repository.ProfileRepository) {
//   err := profileRepository.Delete("U1")

//   if err != nil {
//     fmt.Println(err)
//   } else {
//     fmt.Println("Profile deleted..")
//   }
// }



// func getProfiles(w http.ResponseWriter, req *http.Request) {
// //
//   fmt.Println("Go Mongo Db")

//   db, err := config.GetMongoDB()

//   if err != nil {
//     fmt.Println(err)
//   }

//   profileRepository := repository.NewProfileRepositoryMongo(db, "Profile")

//   //
//   profiles, err := profileRepository.FindAll()

//   if err != nil {
//     fmt.Println(err)
//   }

//   for _, profile := range profiles{
//     fmt.Println("-----------------------")
//     fmt.Println(profile.ID)
//     fmt.Println(profile.FirstName)
//     fmt.Println(profile.LastName)
//     fmt.Println(profile.Email)
//   }
// }
