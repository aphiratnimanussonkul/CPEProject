package repository

import (
	// "time"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"CPEProject/src/models"
)

type SubjectRepositoryMongo struct {
	db *mgo.Database
	collection string
}

//NewProfileRepositoryMongo
func NewSubjectRepository(db *mgo.Database, collection string) *SubjectRepositoryMongo{
	return &SubjectRepositoryMongo{
		db: db,
		collection: collection,
	}
}

//Save
func (r *SubjectRepositoryMongo) Save(subject *models.Subject) error{
	err := r.db.C(r.collection).Insert(subject)
	return err
}

//Update
func (r *SubjectRepositoryMongo) Update(id string, subject *models.Subject) error{
	//Get ตัวแปรแล้วมาเปลี่ยนค่าแล้ว save
	// faculty.UpdatedAt = time.Now()
	err := r.db.C(r.collection).Update(bson.M{"id": id}, subject)
	return err
}

//Delete
func (r *SubjectRepositoryMongo) Delete(id string) error{
	err := r.db.C(r.collection).Remove(bson.M{"id": id})
	return err
}

//FindByID
func (r *SubjectRepositoryMongo) FindByID(id string) (*models.Subject, error){
	var subject models.Subject
	err := r.db.C(r.collection).Find(nil).One(&subject)

	if err != nil {
		return nil, err
	}

	return &subject, nil
}

//FindAll
func (r *SubjectRepositoryMongo) FindAll() (models.Subjects, error){
	var subject models.Subjects

	err := r.db.C(r.collection).Find(bson.M{}).All(&subject)

	if err != nil {
		return nil, err
	}

	return subject, nil
}


//FindByName
func (r *SubjectRepositoryMongo) FindByName(name string) (*models.Subject, error){
	var subject models.Subject
	err := r.db.C(r.collection).Find(bson.M{"name": name}).One(&subject)

	if err != nil {
		return nil, err
	}

	return &subject, nil
}

func (r *SubjectRepositoryMongo) FindByCode(code string) (*models.Subject, error){
	var subject models.Subject
	err := r.db.C(r.collection).Find(bson.M{"code": code}).One(&subject)

	if err != nil {
		return nil, err
	}

	return &subject, nil
}


func (r *SubjectRepositoryMongo) FindByMajor (majorName string) (models.Subjects, error){
	var subject models.Subjects
	err := r.db.C(r.collection).Find(bson.M{"major.name": majorName}).All(&subject)
	if err != nil {

	}
	return subject, nil
}

func (r *SubjectRepositoryMongo) FindByCodeEx(code string) (models.Subjects, error){
	var subject models.Subjects
	err := r.db.C(r.collection).Find(bson.M{"code": bson.RegEx{code, ""}}).All(&subject)

	if err != nil {
	
	}

	return subject, nil
}