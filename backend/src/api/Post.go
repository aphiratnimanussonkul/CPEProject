package api

import (
	"CPEProject/config"
	"CPEProject/src/models"
	"CPEProject/src/repository"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"io/ioutil"
	"net/http"
	"strings"
	"time"
)

func AddPost(w http.ResponseWriter, req *http.Request) {
	fmt.Println(req.URL.String())
	fmt.Println(req.Header)
	fmt.Println(req.Body)
	b, err := ioutil.ReadAll(req.Body)
	defer req.Body.Close()
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	fmt.Println(b)

	// Unmarshal
	var msg models.Post
	err = json.Unmarshal(b, &msg)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	fmt.Println("msg" ,msg.Text)
	fmt.Println("msg" ,msg.User.Lastname)

	output, err := json.Marshal(msg)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	fmt.Println("outpuy", output)
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
	var text = string(params["text"])
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

	var p models.Post
	p.Text = text
	p.Timestamp = currentTime.Format("3:4:5")
	p.Date = currentTime.Format("2006-01-02")
	p.User = user
	p.Subject = subject

	if strings.Contains( req.URL.String(), "postvdo") {
		var vdoLink = string(params["vdoLink"])
		var vdoLinkAll []string
		vdoLinkAll = append(vdoLinkAll, vdoLink)
		p.VdoLink = vdoLinkAll
	} else if strings.Contains( req.URL.String(), "postfile") {
		var URLName = string(params["name"])
		var URLToken = string(params["token"])
		var FileAll []string
		FileAll = append(FileAll, URLName + "?" + URLToken)
		p.File = FileAll
	} else if strings.Contains( req.URL.String(), "postfull") {
		var URLName = string(params["name"])
		var URLToken = string(params["token"])
		var vdoLink = string(params["vdoLink"])

		var FileAll,vdoLinkAll  []string
        vdoLinkAll = append(vdoLinkAll, vdoLink)
		FileAll = append(FileAll, URLName + "?" + URLToken)
		p.VdoLink = vdoLinkAll
		p.File = FileAll
	} else {
	}

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

func UploadFileChunk(w http.ResponseWriter, r *http.Request) {
	fmt.Println("File Upload Endpoint Hit")

	r.ParseMultipartForm(10 << 20)

	file, handler, err := r.FormFile("profile")
	if err != nil {
		fmt.Println("error can not get data")
		fmt.Println(err)
		return
	}

	//name := strings.Split(handler.Filename, ".")
	fmt.Println(handler, file)
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
	var text = string(params["text"])
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

	var p models.Post
	p.Text = text
	p.Timestamp = currentTime.Format("3:4:5")
	p.Date = currentTime.Format("2006-01-02")
	p.User = user
	p.Subject = subject
	var vdoLinkAll []string
	vdoLinkAll = append(vdoLinkAll, vdoLink)
	p.VdoLink = vdoLinkAll
	postRepository.Save(&p)

}



