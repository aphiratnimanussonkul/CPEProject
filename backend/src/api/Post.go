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
	b, err := ioutil.ReadAll(req.Body)
	defer req.Body.Close()
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	// Unmarshal
	var msg models.Post
	err = json.Unmarshal(b, &msg)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}
	postRepository := repository.NewPostRepository(db, "Post")
	userRepository := repository.NewUserRepository(db, "User")
	subjectRepository := repository.NewSubjectRepository(db, "Subject")
	currentTime := time.Now()

	user, err2 := userRepository.FindByEmail(msg.User.Email)
	if err2 != nil {
		fmt.Println(err2)
	}

	subject, err3 := subjectRepository.FindByCode(msg.Subject.Code)
	if err3 != nil {
		fmt.Println(err3)
	}

	var p models.Post
	p.Text = msg.Text
	p.Timestamp = currentTime.Format("3:4:5")
	p.Date = currentTime.Format("2006-01-02")
	p.User = user
	p.Subject = subject

	if strings.Contains( req.URL.String(), "postvdo") {
		// var vdoLink = string(params["vdoLink"])
		var vdoLinkAll []string
		for i := 0; i < len(msg.VdoLink); i++ {
			vdoLinkAll = append(vdoLinkAll, msg.VdoLink[i])
		}
		p.VdoLink = vdoLinkAll
	// } else if strings.Contains( req.URL.String(), "postfile") {
	// 	var URLName = string(params["name"])
	// 	var URLToken = string(params["token"])
		var FileAll []string
		for i := 0; i < len(msg.File); i++ {
			FileAll = append(FileAll, msg.File[i])
		}
		p.File = FileAll
	} else if strings.Contains( req.URL.String(), "post") {
		// var URLName = string(params["name"])
		// var URLToken = string(params["token"])
		// var vdoLink = string(params["vdoLink"])
		var FileAll,vdoLinkAll,PicAll, FileNameAll  []string
		for i := 0; i < len(msg.VdoLink); i++ {
			if msg.VdoLink[i] == "" {
				continue
			}
			vdoLinkAll = append(vdoLinkAll, msg.VdoLink[i])
		}
		for i := 0; i < len(msg.File); i++ {
			if msg.File[i] == "" {
				continue
			}
			FileAll = append(FileAll, msg.File[i])
		}
		for i := 0; i < len(msg.Picture); i++ {
			if msg.Picture[i] == "" {
				continue
			}
			PicAll = append(PicAll, msg.Picture[i])
		}
		for i := 0; i < len(msg.FileName); i++ {
			if msg.FileName[i] == "" {
				continue
			}
			FileNameAll = append(FileNameAll, msg.FileName[i])
		}
		p.FileName = FileNameAll
		p.VdoLink = vdoLinkAll
		p.File = FileAll
		p.Picture = PicAll
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




