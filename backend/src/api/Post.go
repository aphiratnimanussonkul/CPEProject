package api

import (
	"CPEProject/config"
	"CPEProject/src/models"
	"CPEProject/src/repository"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"gopkg.in/mgo.v2/bson"
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
	}
	// Unmarshal
	var msg models.Post
	err = json.Unmarshal(b, &msg)
	if err != nil {
		http.Error(w, err.Error(), 500)
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


	// Vdo
	if msg.VdoLink != nil {
		var status string
		p.VdoLink, status = getVdoLink(msg.VdoLink)
		if status != "1" {
			json.NewEncoder(w).Encode(status)

		} else {
			// File
			if msg.File != nil {
				p.File = getFile(msg.File)
				p.FileName = msg.FileName;
				fmt.Println(msg.File)
			}
			// Picture
			if msg.Picture != nil {
				p.Picture = getPicture(msg.Picture)
				fmt.Println(msg.Picture)
			}
			postRepository.Save(&p)
		}
	} else {
		postRepository.Save(&p)
	}


}

func getVdoLink (vdoLink []string)  ([]string, string){
	var vdoLinkAll []string
	for i := 0; i < len(vdoLink); i++ {
		var temp []string
		if vdoLink[i] == "" {
			continue
		} else if strings.Contains(vdoLink[i], "https://www.youtube.com/watch?v") {
			temp = strings.Split(vdoLink[i], "=");
			if strings.Contains(vdoLink[i], "&list") {
				temp = strings.Split(temp[1], "&");
				vdoLink[i] = "https://www.youtube.com/embed/" + temp[0];
			} else {
				vdoLink[i] = "https://www.youtube.com/embed/" + temp[1];
			}
			vdoLinkAll = append(vdoLinkAll, vdoLink[i])
		} else {
			return  nil, "Can not post, Please make sure you enter correct youtube link"
		}
	}
	return vdoLinkAll, "1"
}

func getFile (File []string) ([]string) {
	var FileAll []string
	for i := 0; i < len(File); i++ {
		if File[i] == "" {
			continue
		}
		FileAll = append(FileAll, File[i])
	}
	return FileAll
}

func getPicture (Picture []string) ([] string) {
	var PicAll []string
	for i:= 0; i < len(Picture); i++ {
		if Picture[i] == "" {
			continue
		}
		PicAll = append(PicAll, Picture[i])
	}
	return PicAll
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

func DeletePost(w http.ResponseWriter, req *http.Request) {
	//
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}

	postRepository := repository.NewPostRepository(db, "Post")
	params := mux.Vars(req)
	var postId = string(params["postid"])
	fmt.Println(postId)
	post , err := postRepository.FindByID(bson.ObjectIdHex(postId))
	fmt.Println(post)
	err = postRepository.Delete(post)
	if err != nil {
	}
}
func GetPostById(w http.ResponseWriter, req *http.Request) {
	//
	db, err := config.GetMongoDB()
	if err != nil {
		fmt.Println(err)
	}

	postRepository := repository.NewPostRepository(db, "Post")

	params := mux.Vars(req)
	var postid = string(params["postid"])
	post, err2 := postRepository.FindByID(bson.ObjectIdHex(postid))
	if err2 != nil {
		fmt.Println(err2)
	}
	json.NewEncoder(w).Encode(post)

}
