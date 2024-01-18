export function useJson() {
  const jsonInput = useState<string>('json:input')

  return {
    jsonInput,
    loadTestJson() {
      jsonInput.value = JSON.parse(testJson)
    },
    loadTestJson2() {
      jsonInput.value = JSON.parse(testJson2)
    }
  }
}
const testJson = `{
  "links": {
    "self": "http://example.com/articles",
    "next": "http://example.com/articles?page[offset]=2",
    "last": "http://example.com/articles?page[offset]=10"
  },
  "data": [{
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "JSON:API paints my bikeshed!"
    },
    "relationships": {
      "author": {
        "links": {
          "self": "http://example.com/articles/1/relationships/author",
          "related": "http://example.com/articles/1/author"
        },
        "data": { "type": "people", "id": "9" }
      },
      "comments": {
        "links": {
          "self": "http://example.com/articles/1/relationships/comments",
          "related": "http://example.com/articles/1/comments"
        },
        "data": [
          { "type": "comments", "id": "5" },
          { "type": "comments", "id": "12" }
        ]
      }
    },
    "links": {
      "self": "http://example.com/articles/1"
    }
  }],
  "included": [{
    "type": "people",
    "id": "9",
    "attributes": {
      "firstName": "Dan",
      "lastName": "Gebhardt",
      "twitter": "dgeb"
    },
    "links": {
      "self": "http://example.com/people/9"
    }
  }, {
    "type": "comments",
    "id": "5",
    "attributes": {
      "body": "First!"
    },
    "relationships": {
      "author": {
        "data": { "type": "people", "id": "2" }
      }
    },
    "links": {
      "self": "http://example.com/comments/5"
    }
  }, {
    "type": "comments",
    "id": "12",
    "attributes": {
      "body": "I like XML better"
    },
    "relationships": {
      "author": {
        "data": { "type": "people", "id": "9" }
      }
    },
    "links": {
      "self": "http://example.com/comments/12"
    }
  }]
}`

const testJson2 = `{
  "data": {
    "type": "scholarship",
    "id": "26536",
    "attributes": {
      "title": "Copy of Copy of Test - Easy survey",
      "url": "http:\/\/google.com",
      "publicUrl": "https:\/\/scholarshipowl.com\/scholarship\/26536-copy-of-copy-of-test-easy-survey",
      "termsOfServiceUrl": "",
      "applicationType": "email",
      "startDate": "2023-10-05T00:00:00+02:00",
      "expirationDate": "2024-01-31T23:59:00-08:00",
      "amount": [
        100
      ],
      "awards": 1,
      "confidenceScore": 100,
      "description": "Easy",
      "providerName": "",
      "createdDate": "2024-01-18T14:28:34+01:00",
      "lastUpdatedDate": "2024-01-18T14:31:04+01:00",
      "parentScholarship": null,
      "metaAuthor": null,
      "metaTitle": null,
      "metaDescription": null,
      "metaKeywords": null,
      "isActive": true,
      "isPublished": true,
      "isRecurrent": false,
      "isAutomatic": false,
      "timezone": "US\/Pacific"
    },
    "meta": {
      "isEligible": true
    },
    "links": {
      "self": "\/scholarship\/26536"
    },
    "relationships": {
      "requirementSurvey": {
        "links": {
          "self": "\/scholarship\/26536\/relationships\/requirementSurvey",
          "related": "\/scholarship\/26536\/requirementSurvey"
        },
        "data": [
          {
            "type": "requirementSurvey",
            "id": "3"
          }
        ]
      },
      "application": {
        "links": {
          "self": "\/scholarship\/26536\/relationships\/application",
          "related": "\/scholarship\/26536\/application"
        },
        "data": null
      }
    }
  },
  "included": [
    {
      "type": "applicationSurvey",
      "id": "3",
      "attributes": {
        "answers": [
          {
            "type": "radio",
            "options": [
              "2"
            ],
            "question": "What\u0027s the world\u0027s heaviest metal?"
          }
        ],
        "createdAt": "2024-01-18T14:31:54+01:00",
        "updatedAt": "2024-01-18T14:31:54+01:00"
      },
      "links": {
        "self": "\/applicationSurvey\/3"
      }
    },
    {
      "type": "requirementSurvey",
      "id": "3",
      "attributes": {
        "title": "Flex your nerddom",
        "type": "survey",
        "name": "Survey",
        "requirementNameId": 18,
        "description": "Survey desc here",
        "isOptional": false,
        "survey": [
          {
            "type": "radio",
            "options": {
              "1": "Iridium",
              "2": "Osmium",
              "3": "Lead",
              "4": "Metallica"
            },
            "question": "What\u0027s the world\u0027s heaviest metal?",
            "description": "",
            "id": "75d0ec49"
          }
        ]
      },
      "links": {
        "self": "\/requirementSurvey\/3"
      },
      "relationships": {
        "applicationSurvey": {
          "links": {
            "self": "\/requirementSurvey\/3\/relationships\/applicationSurvey",
            "related": "\/requirementSurvey\/3\/applicationSurvey"
          },
          "data": {
            "type": "applicationSurvey",
            "id": "3"
          }
        }
      }
    }
  ]
}`
