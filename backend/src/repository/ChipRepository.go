package repository
import (
	"fmt"
	// "time"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"CPEProject/src/models"
)

//profileRepositoryMongo
type ChipRepository struct {
	db *mgo.Database
	collection string
}

//NewProfileRepositoryMongo
func NewChipRepositorry(db *mgo.Database, collection string) *ChipRepository{
	return &ChipRepository{
		db: db,
		collection: collection,
	}
}

//Save
func (r *ChipRepository) Save(chip *models.Chip) error{
	err := r.db.C(r.collection).Insert(chip)
	return err
}

//Update
func (r *ChipRepository) Update(chip *models.Chip) error{
	//fmt.Println("In FacRepo")
	//faculty.Name = "MTT"
	//
	//err := r.db.C(r.collection).Update(bson.M{"_id": faculty.ID},
	//   bson.M{"$set": bson.M{"name": "MTT",
	//      "major": major.ID}})
	//return err
	fmt.Println("In ChipRepo")
	err := r.db.C(r.collection).Update(bson.M{"_id": chip.ID}, chip)
	return err
}




//Delete
func (r *ChipRepository) Delete(id string) error{
	err := r.db.C(r.collection).Remove(bson.M{"id": id})
	return err
}

//FindByID
func (r *ChipRepository) FindByID(id string) (*models.Chip, error){
	var chip models.Chip
	err := r.db.C(r.collection).Find(nil).One(&chip)

	if err != nil {
		return nil, err
	}

	return &chip, nil
}

//FindAll
func (r *ChipRepository) FindAll() (models.Chips, error){
	var chip models.Chips

	err := r.db.C(r.collection).Find(bson.M{}).All(&chip)

	if err != nil {
		return nil, err
	}

	return chip, nil
}

func (r *ChipRepository) FindByName(name string) (*models.Chip, error){
	var chip models.Chip
	err := r.db.C(r.collection).Find(bson.M{"name": name}).One(&chip)

	if err != nil {
		return nil, err
	}

	return &chip, nil
}