
//Start off with what passes the first test.
function KNN(kSize){
	// constructor function
	this.kSize = kSize;
	this.points = [];
}

KNN.prototype._distance = function(vectorA, vectorB) {
	// returns distance between two vectors
	const subtraction = vectorA.map((number, index) => {
		return number - vectorB[index]
	})
	const norm = subtraction.reduce((sum, number) => {
		return sum + (number * number)
	}, 0)

	return norm;
}

KNN.prototype._distances = function(vector, classifiedVectors) {
	// note: classifiedVectors is like training data -- it has two parts:
	// the vector element and its classification
	return classifiedVectors.map(classifiedVector => {
		const distance = this._distance(classifiedVector[0], vector)
		const classification = classifiedVector[1] // just use the same classification
		return [distance, classification]
	})
}

KNN.prototype._sorted = function(distancesArray) {
	const sorted = distancesArray.sort( (elementA, elementB) => {
		if (elementA[0] < elementB[0]) {
			return -1
		}
		if (elementA[0] > elementB[0]) {
			return 1
		}
		return 0
	})
	const sortedClassifications =  sorted.map( element => {
		return element[1]
	}) // this returns an array that just has the classifications
	// sort the array in order of distance
	// just return the classifications (once they have been sorted)
	return sortedClassifications;
}

KNN.prototype._majority = function(k, sortedClassifications) {
	// say what classification is most common among the first k elements
	// of a sorted list of data

	const elementsToConsider = sortedClassifications.slice(0, k);
	const classificationsObject = {}

	for (let i = 0; i < elementsToConsider.length; i++) {
		const classification = elementsToConsider[i]
		if (classificationsObject[classification]) {
			classificationsObject[classification]++
		} else {
			classificationsObject[classification] = 1
		}
	}
	// now we have an object that stores the number of times each classification occurs in the array slice

	let maxKey;
	let max;

	for (let key in classificationsObject) {
		if (classificationsObject.hasOwnProperty(key)) {
			if (max === undefined) {
				maxKey = key
				max = classificationsObject[key]
			} else if (classificationsObject[key] > max) {
				maxKey = key
				max = classificationsObject[key]
			}
		}
	}

	return +maxKey
}

KNN.prototype.train = function(trainingData) {
	// store the trainingData
	this.points = [...this.points, ...trainingData]
}

KNN.prototype.predictSingle = function(vector) {
	// use training data inside the knn instance to predict what classification it has

	const neighbors = this._distances(vector, this.points)
	const sortedNeighborClassifications = this._sorted(neighbors)

	return this._majority(this.kSize, sortedNeighborClassifications)
}

KNN.prototype.predict = function(vectorArray) {
	return vectorArray.map( vector => this.predictSingle(vector))
}

KNN.prototype.score = function(testingData) {
	// check to see if our 'predict' matches with the action testingData elements' classifications
	const vectorsOnly = testingData.map(datum => datum[0])
	const predictions = this.predict(vectorsOnly);
	let totalCorrect = 0;

	for (let i = 0; i < testingData.length; i++) {
		const actualClassification = testingData[i][1]
		const predictedClassification = predictions[i];
		if (actualClassification === predictedClassification) {
			totalCorrect++
		}
	}

	const percent = ( totalCorrect / testingData.length )
	return percent
}

module.exports = KNN
