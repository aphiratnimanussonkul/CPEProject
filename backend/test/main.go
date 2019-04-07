package main

import (
		"fmt"
		"encoding/json"
		"gopkg.in/couchbase/gocb.v1"
		"github.com/gorilla/handlers"
		"github.com/gorilla/mux"
		"net/http"
		"log"
)
type Person struct {
	ID 			string `json:"id,omitempty"`
	Firstname	string `json:"firstname,omitempty"`
	Lastname	string `json:"lastname,omitempty"`
	Social []SocialMedia `json:"socialmedia,omitempty"`
	Address *Address `json:"address,omitempty"`
}

type Address struct {
	City string `json:"city,omitempty"`
	State string `json:"state,omitempty"`
}
type SocialMedia struct{
	Title string `json:"title"`
	Link string `json:"link"`
}

var People []Person
var bucket *gocb.Bucket

func getPersonEndpoint(w http.ResponseWriter, req *http.Request){

}

func getPeopleEndpoint(w http.ResponseWriter, req *http.Request){
	fmt.Println("getIn")
	cluster, _ := gocb.Connect("couchbase://localhost")
	cluster.Authenticate(gocb.PasswordAuthenticator{
        Username: "Administrator",
        Password: "Ththth00",
    })
	fmt.Println(cluster)
	bucket, _ := cluster.OpenBucket ("restful-sample", "")
	bucket.Upsert("aphirat2", Person{
		Firstname : "Nic",
		Lastname: "Raboy",
		Social: []SocialMedia{
			{Title: "Twitter", Link: "http://www.twitter.com/nraboy"},
			{Title: "Github", Link: "http://www.github.com/nraboy"},
		},
	},0)
	
}
func CreatePersonEndpoint(w http.ResponseWriter, req *http.Request) {
	fmt.Println("getIn")
    // var n1qlParams []interface{}
    // _ = json.NewDecoder(req.Body).Decode(&People)
    // query := gocb.NewN1qlQuery("INSERT INTO `restful-sample` (KEY, VALUE) VALUES ($1, {'firstname': $2, 'lastname': $3})") 
	// n1qlParams = append(n1qlParams, "aphirat")
    // n1qlParams = append(n1qlParams, "sdsdd")
    // n1qlParams = append(n1qlParams, "sdsdd")

    // _, err := bucket.ExecuteN1qlQuery(query, n1qlParams)
    // if err != nil {
    //     w.WriteHeader(401)
    //     w.Write([]byte(err.Error()))
    //     return
    // }
	// json.NewEncoder(w).Encode(People)
	cluster, _ := gocb.Connect("couchbase://localhost")
	cluster.Authenticate(gocb.PasswordAuthenticator{
        Username: "Administrator",
        Password: "Ththth00",
    })
	fmt.Println(cluster)
	var person Person
	bucket, _ := cluster.OpenBucket ("restful-sample", "")
	bucket.Upsert("aphirat1", Person{
		Firstname : "Nic",
		Lastname: "Raboy",
		Social: []SocialMedia{
			{Title: "Twitter", Link: "http://www.twitter.com/nraboy"},
			{Title: "Github", Link: "http://www.github.com/nraboy"},
		},
	},0)
	bucket.Get("nraboy", &person)
	//jsonBytes, _ := json.Marshal(person)
	//Return data to Angular
	json.NewEncoder(w).Encode(person)
}

func createPerson(w http.ResponseWriter, req *http.Request){

}

func deletePerson(w http.ResponseWriter, req *http.Request){

}


func main(){
	

	cluster, _ := gocb.Connect("couchbase://localhost")
	cluster.Authenticate(gocb.PasswordAuthenticator{
        Username: "Administrator",
        Password: "Ththth00",
    })
	fmt.Println(cluster)
	bucket, _ := cluster.OpenBucket ("restful-sample", "")
	var person Person
	bucket.Upsert("nraboy", Person{
		Firstname : "Nic",
		Lastname: "Raboy",
		Social: []SocialMedia{
			{Title: "Twitter", Link: "http://www.twitter.com/nraboy"},
			{Title: "Github", Link: "http://www.github.com/nraboy"},
		},
	},0)
	bucket.Get("nraboy", &person)
	jsonBytes, _ := json.Marshal(person)
	fmt.Println(string(jsonBytes)) 

	router := mux.NewRouter()
	// People = append(People, Person{ID: "1",
	// 						 Firstname: "Nic", 
	// 						 Lastname: "sss", 
	// 						 Address: &Address{City: "test",
	// 						  					State: "dhgghj"},
	// 						},
	// 				)
	router.HandleFunc("/test", CreatePersonEndpoint).Methods("GET")
	router.HandleFunc("/home", getPeopleEndpoint).Methods("GET")
	// log.Fatal(http.ListenAndServe(":12345", router))
	log.Fatal(http.ListenAndServe(":12345", handlers.CORS(handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD"}), handlers.AllowedOrigins([]string{"*"}))(router)))
}