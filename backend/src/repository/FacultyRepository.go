package repository

import (
  // "time"
  mgo "gopkg.in/mgo.v2"
  "gopkg.in/mgo.v2/bson"

  "CPEProject/src/models"
)

//profileRepositoryMongo
type FacultyRepositoryMongo struct {
  db *mgo.Database
  collection string
}

//NewProfileRepositoryMongo
func NewProfileRepositoryMongo(db *mgo.Database, collection string) *FacultyRepositoryMongo{
  return &FacultyRepositoryMongo{
    db: db,
    collection: collection,
  }
}

//Save
func (r *FacultyRepositoryMongo) Save(faculty *models.Faculty) error{
  err := r.db.C(r.collection).Insert(faculty)
  return err
}

//Update
func (r *FacultyRepositoryMongo) Update(id string, faculty *models.Faculty) error{
  //Get ตัวแปรแล้วมาเปลี่ยนค่าแล้ว save
  // faculty.UpdatedAt = time.Now()
  err := r.db.C(r.collection).Update(bson.M{"id": id}, faculty)
  return err
}

//Delete
func (r *FacultyRepositoryMongo) Delete(id string) error{
  err := r.db.C(r.collection).Remove(bson.M{"id": id})
  return err
}

//FindByID
func (r *FacultyRepositoryMongo) FindByID(id string) (*models.Faculty, error){
  var faculty models.Faculty
  err := r.db.C(r.collection).Find(nil).One(&faculty)

  if err != nil {
    return nil, err
  }

  return &faculty, nil
}

//FindAll
func (r *FacultyRepositoryMongo) FindAll() (models.Faculties, error){
  var faculty models.Faculties

  err := r.db.C(r.collection).Find(bson.M{}).All(&faculty)

  if err != nil {
    return nil, err
  }

  return faculty, nil
}
