package repository

import (
	// "time"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"CPEProject/src/models"
)

type CommentRepository struct {
	db *mgo.Database
	collection string
}

//NewProfileRepositoryMongo
func NewCommentRepository(db *mgo.Database, collection string) *CommentRepository{
	return &CommentRepository{
		db: db,
		collection: collection,
	}
}

//Save
func (r *CommentRepository) Save(user *models.Comment) error{
	err := r.db.C(r.collection).Insert(user)
	return err
}

//Update
func (r *CommentRepository) Update(id string, comment *models.Comment) error{
	//Get ตัวแปรแล้วมาเปลี่ยนค่าแล้ว save
	// faculty.UpdatedAt = time.Now()
	err := r.db.C(r.collection).Update(bson.M{"id": id}, comment)
	return err
}

//Delete
func (r *CommentRepository) Delete(id string) error{
	err := r.db.C(r.collection).Remove(bson.M{"id": id})
	return err
}

//FindByID
func (r *CommentRepository) FindByID(id bson.ObjectId) (*models.Comment, error){
	var comment models.Comment
	err := r.db.C(r.collection).Find(bson.M{"_id": id}).One(&comment)

	if err != nil {
		return nil, err
	}

	return &comment, nil
}

//FindAll
func (r *CommentRepository) FindAll() (models.Comments, error){
	var comment models.Comments

	err := r.db.C(r.collection).Find(nil).All(&comment)
	if err != nil {
		return nil, err
	}
	return comment, nil
}


//FindByName
func (r *CommentRepository) FindByName(name string) (*models.Comment, error){
	var comment models.Comment
	err := r.db.C(r.collection).Find(bson.M{"text": name}).One(&comment)

	if err != nil {
		return nil, err
	}

	return &comment, nil
}

