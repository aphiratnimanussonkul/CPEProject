package api

import (
	"CPEProject/config"
	"CPEProject/src/models"
	"CPEProject/src/repository"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
	"time"
)

func AddPost(w http.ResponseWriter, req *http.Request) {
	//
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	postRepository := repository.NewPostRepository(db, "Post")
	userRepository := repository.NewUserRepository(db, "User")
	subjectRepository := repository.NewSubjectRepository(db, "Subject")
	currentTime := time.Now()
	//get variable by path
	params := mux.Vars(req)
	var email = string(params["email"])
	var code = string(params["code"])
	user, err2 := userRepository.FindByEmail(email)
	if err2 != nil {
		fmt.Println(err2)
	}

	subject, err3 := subjectRepository.FindByCode(code)
	if err3 != nil {
		fmt.Println(err3)
	}

	var text string
	text = string(params["text"])

	var p models.Post
	p.Text = text
	p.Timestamp = currentTime.Format("3:4:5")
	p.Date = currentTime.Format("2006-01-02")
	p.User = user
	p.Subject = subject
	postRepository.Save(&p)

}

func GetPostAll(w http.ResponseWriter, req *http.Request) {
	//
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	postRepository := repository.NewPostRepository(db, "Post")
	post, err2 := postRepository.FindAll()
	if err2 != nil {
		fmt.Println(err2)
	}
	json.NewEncoder(w).Encode(post)

}
func GetPostByCode(w http.ResponseWriter, req *http.Request) {
	//
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}

	postRepository := repository.NewPostRepository(db, "Post")

	params := mux.Vars(req)
	var code = string(params["code"])
	post, err2 := postRepository.FindByCode(code)
	if err2 != nil {
		fmt.Println(err2)
	}
	json.NewEncoder(w).Encode(post)

}

func UploadFileChunk(w http.ResponseWriter,r *http.Request) {
	fmt.Println("File Upload Endpoint Hit")

	r.ParseMultipartForm(10 << 20)

	file, handler, err := r.FormFile("profile")
	if err != nil {
		fmt.Println("error can not get data")
		fmt.Println(err)
		return
	}

	//name := strings.Split(handler.Filename, ".")
	fmt.Println(handler,file)
	//
	//db, err := config.GetMongoDB()
	//if err != nil {
	//
	//}
	//
	//src, err := handler.Open()
	//if err != nil {
	//
	//	return
	//}
	//defer src.Close()
	//
	//
	//dst, err := os.Create("./img/" + handler.Filename)
	//if err != nil {
	//	fmt.Println(err)
	//	return
	//}
	//defer dst.Close()
	//
	//io.Copy(dst, src)
	//
	//imgRepository := repository.NewImgRepository(db, "Img")
	//imgRepository.Save(img)
	//json.NewEncoder(w).Encode(img.ID)
}

func AddPostWithLink(w http.ResponseWriter, req *http.Request) {
	//
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	postRepository := repository.NewPostRepository(db, "Post")
	userRepository := repository.NewUserRepository(db, "User")
	subjectRepository := repository.NewSubjectRepository(db, "Subject")
	currentTime := time.Now()
	//get variable by path
	params := mux.Vars(req)
	var email = string(params["email"])
	var code = string(params["code"])
	var vdoLink = string(params["vdoLink"])
	user, err2 := userRepository.FindByEmail(email)
	if err2 != nil {
		fmt.Println(err2)
	}

	subject, err3 := subjectRepository.FindByCode(code)
	if err3 != nil {
		fmt.Println(err3)
	}

	var text string
	text = string(params["text"])

	var p models.Post
	p.Text = text
	p.Timestamp = currentTime.Format("3:4:5")
	p.Date = currentTime.Format("2006-01-02")
	p.User = user
	p.Subject = subject
	p.VdoLink = vdoLink;

	postRepository.Save(&p)

}

