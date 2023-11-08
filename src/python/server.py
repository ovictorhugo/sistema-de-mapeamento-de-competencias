from flask import Flask, jsonify, request
import SimccBD
import json
import nltk
import unidecode

from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})



app = Flask(__name__)

list_researcher  = [
    {
        'id': '1',
        'name': 'Eduardo Jorge',
        'among': '10',
        'articles':'38',
        'book_chapters':'20',
        'university':'Universidade do Estado da Bahia'

    },
    {
        'id': '2',
        'name': 'Hugo Saba',
        'among': '8',
        'articles':'50',
        'book_chapters':'10',
        'university':'Universidade do Estado da Bahia'

    },
    {
        'id': '3',
        'name': 'Anibal Santos',
        'lang': '1',
         'articles':'20',
        'book_chapters':'5',
        'university':'Universidade do Estado da Bahia'

    }
]



universities_ = [ {
    'id':'1',
    'name':'Universidade do Estado da Bahia'
},
{
    'id':'2',
    'name':'Universidade Estadual de Santa Cruz'
},
{
    'id':'3',
    'name':'Universidade Estadual de Feira de Santana'
},
{
    'id':'4',
    'name':'Universidade Estadual do Sudoeste da Bahia'
},



]

area_ = [
    {
    
    'id':'1',
    'area':'Ciência da Saúde',
    'subarea':[{'id':'1',
                'name':'Medicina'
                 },
                 {'id':'2',
                'name':'Enfermagem'
                 },

    
                ]
    
    },
    {
    
    'id':'2',
    'area':'Ciência Humanas',
    'subarea':[{'id':'3',
                'name':'Educação'
                 },
                 {'id':'4',
                'name':'História'
                 },

    
                ]
    
    }





]

@app.route('/researcher', methods=['GET'])
def research():
    list_researcher  = []
    term = request.args.get('term')
    stemmer = nltk.RSLPStemmer()
    termNovo=unidecode.unidecode(term)
    
    print(termNovo)
    print(stemmer.stem(termNovo))
    df_bd =SimccBD.researchers_term_db(stemmer.stem(termNovo))
    #df_bd.sort_values(by="articles", ascending=False, inplace=True)
    for i,infos in df_bd.iterrows():
        researcher  = {
        'id': str(infos.id),
        'name': str(infos.researcher_name),
        'among': str(infos.qtd),
        'articles':str(infos.articles),
        'book_chapters':str(infos.book_chapters),
        'university':str(infos.institution)

        }
        #print(researcher)
        list_researcher.append(researcher) 



    #print(list_researcher)
    term = request.args.get('term')
    universities_id = request.args.get('universities_id')
    area_id = request.args.get('universities_id')
    area_id = request.args.get('area_id')
    subarea_id = request.args.get('subarea_id')
    #print(term)
    return jsonify(list_researcher), 200

@app.route('/total', methods=['GET'])
def total():

    researcher_total = SimccBD.researcher_total_db()
    institution_total = SimccBD.institution_total_db()
    bibliographic_production_total = SimccBD.bibliographic_production_total_db()

    print(researcher_total)


    total_ = [{
    "researcher": str(researcher_total),
    "publications": str(bibliographic_production_total),
    "organizations": str(institution_total) 

    }]
   
   


    
    return jsonify(total_), 200

@app.route('/universities', methods=['GET'])
def universities():
    
    return jsonify(universities_), 200

@app.route('/area', methods=['GET'])
def area():
    
    return jsonify(area_), 200




if __name__ == "__main__":
    app.run(debug=True)