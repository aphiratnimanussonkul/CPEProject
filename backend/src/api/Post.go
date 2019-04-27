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
				p.File, p.FileName = getFile(msg.File)
			}
			// Picture
			if msg.Picture != nil {
				p.Picture = getPicture(msg.Picture)
			}
			postRepository.Save(&p)
		}
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

func getFile (File []string) ([]string, []string) {
	var FileAll, FileNameAll, temp []string
	for i := 0; i < len(File); i++ {
		if File[i] == "" {
			continue
		}
		FileAll = append(FileAll, File[i])

		temp = strings.Split(File[i], "/")
		temp = strings.Split(temp[7], "?")
		FileNameAll = append(FileNameAll, temp[0])
	}
	return FileAll, FileNameAll
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
