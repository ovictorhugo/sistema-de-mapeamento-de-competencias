import requests
import json
import pandas as pd
import psycopg2
import nltk
from nltk.tokenize import RegexpTokenizer


# Função para consultas no banco
def consultar_db(sql):
  con = conecta_db()
  cur = con.cursor()
  cur.execute(sql)
  recset = cur.fetchall()
  registros = []
  for rec in recset:
    registros.append(rec)
  con.close()
  return registros

# Função para criar conexão no banco
def conecta_db():
  con = psycopg2.connect(host='localhost', 
                         database='simcc_',
                         user='postgres', 
                         password='root')
  return con

# Função para consultar o Banco SIMCC
def researcher_text_db():
  reg = consultar_db('SELECT   id from researcher '+
                    'where id=\'35e6c140-7fbb-4298-b301-c5348725c467\''+
                    ' OR id=\'c0ae713e-57b9-4dc3-b4f0-65e0b2b72ecf\' ')
  df_bd = pd.DataFrame(reg, columns=['id'])
  m=[];
  for i,infos in df_bd.iterrows():
      print(infos.id)
      m.append(production_db(infos.id))
  return m     

# Função para consultar o Banco SIMCC
def term_frequency_substring_db():
  reg = consultar_db('SELECT   id from researcher '+
                    'where id=\'35e6c140-7fbb-4298-b301-c5348725c467\''+
                    ' OR id=\'c0ae713e-57b9-4dc3-b4f0-65e0b2b72ecf\' ')
  df_bd = pd.DataFrame(reg, columns=['id'])
  m=[];
  for i,infos in df_bd.iterrows():
      print(infos.id)
      m.append(production_db(infos.id))
  return m     





# Função para consultar o Banco SIMCC
def production_db(researcher_id):
  reg = consultar_db('SELECT  distinct title,b.type,year from bibliographic_production AS b, bibliographic_production_author AS ba'+
  ' WHERE b.id = ba.bibliographic_production_id '+
    '  AND researcher_id=\''+ researcher_id +"\'"+
      #' AND "type" = \'ARTICLE\' '+
      #' AND b.title LIKE \'%ROBÓTICA%\' '+
      ' GROUP BY title,b.type,year')
  df_bd = pd.DataFrame(reg, columns=['title','b.type','year'])
    #print(df_bd.head())
  texto ="" 
  
  for i,infos in df_bd.iterrows():
      #print(infos.title)
      #print(infos.year)
      #Retirando a pontuação
      tokenize = RegexpTokenizer(r'\w+')
      tokens =[]
      tokens = tokenize.tokenize(infos.title)   
      print(infos.title) 
      # Teste de Algoritmo tokens = tokenize.tokenize("Eu sou a pessoa mais feliz pessoa sou.")    
      #retirando termos duplicados
      lista=[]
      lista = list(set(tokens))
      print(lista)
      for word in lista: 
          texto = texto + " " + word;
          #print("-----")
          #print(word)
 


  linha=[]
  linha.append(researcher_id)   
  linha.append(texto)
  #print(researcher_id)
  #print(texto)
   
  return  linha
 # Função para inserir dados no banco
def execScript_db(sql):
    con = conecta_db()
    cur = con.cursor()
    try:
        cur.execute(sql)
        con.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print("Error: %s" % error)
        con.rollback()
        cur.close()
        return 1
    cur.close()



# Função para consultar o Banco SIMCC
def bibliographic_production_total_db():
  reg = consultar_db('SELECT COUNT(DISTINCT title) as qtd FROM bibliographic_production ')
                    #'where id=\'35e6c140-7fbb-4298-b301-c5348725c467\''+
                    #' OR id=\'c0ae713e-57b9-4dc3-b4f0-65e0b2b72ecf\' ')
  df_bd = pd.DataFrame(reg, columns=['qtd'])
 
  return df_bd['qtd'].iloc[0]   

# Função para consultar o Banco SIMCC
def researcher_total_db():
  reg = consultar_db('SELECT COUNT(*) as qtd FROM researcher ')
                    #'where id=\'35e6c140-7fbb-4298-b301-c5348725c467\''+
                    #' OR id=\'c0ae713e-57b9-4dc3-b4f0-65e0b2b72ecf\' ')
  df_bd = pd.DataFrame(reg, columns=['qtd'])
 
  return df_bd['qtd'].iloc[0]   

# Função para consultar o Banco SIMCC
def institution_total_db():
  reg = consultar_db('SELECT COUNT(*) as qtd FROM institution ')
                    #'where id=\'35e6c140-7fbb-4298-b301-c5348725c467\''+
                    #' OR id=\'c0ae713e-57b9-4dc3-b4f0-65e0b2b72ecf\' ')
  df_bd = pd.DataFrame(reg, columns=['qtd'])
 
  return df_bd['qtd'].iloc[0]   

# Função para consultar o Banco SIMCC
def researchers_term_db(term):
   
     reg = consultar_db('SELECT term,rt.researcher_id as id,SUM(amount) AS qtd,'+
                        'r.name as researcher_name,originals_words,i.name as institution,rp.articles as articles,rp.book_chapters as book_chapters '+
                         ' FROM researcher_term rt, researcher r , institution i, researcher_production rp '+
                          ' WHERE '+
                          ' rp.researcher_id = r.id'
                          ' AND r.institution_id = i.id '+
                          ' AND rt.researcher_id = r.id '+
                          ' AND term = \''+term+"\'"
                          ' GROUP BY  term,rt.researcher_id,r.name, originals_words, i.name,articles, book_chapters'+
                          ' ORDER BY qtd desc')
     df_bd = pd.DataFrame(reg, columns=['term','id','qtd','researcher_name','originals_words','institution','articles','book_chapters'])
    
     return df_bd
# Função para Pesquisar os pesquisadores por nome
# https://www.postgresql.org/docs/9.3/textsearch-intro.html#TEXTSEARCH-DOCUMENT
def lista_researcher_name_db(text):
     tokenize = RegexpTokenizer(r'\w+')
     tokens =[]
     tokens = tokenize.tokenize(text)  
     term=""
     print(tokens.count)
     #if tokens.count>1:
     for word in tokens:
            term = term + word + " & "
     #else:
        #term = tokens[0]   
     x = len(term)   
     termX = term[0:x-3]
     print(termX)  
    

   
     reg = consultar_db('SELECT  name,id FROM researcher WHERE '+
                       ' (name::tsvector@@ \''+termX+'\'::tsquery)=true')
     df_bd = pd.DataFrame(reg, columns=['name','id'])
     return df_bd
    

# Função para listar todos os pesquisadores e criar a sua produção
def create_researcher_production_db():

 
     sql = "DELETE FROM researcher_production"
     execScript_db(sql)

     reg = consultar_db('SELECT   id from researcher ')
                   
     df_bd = pd.DataFrame(reg, columns=['id'])
    
     for i,infos in df_bd.iterrows():
      print(infos.id)
      new_researcher_production_db(infos.id)
    


# Função processar e inserir a produção de cada pesquisador
def new_researcher_production_db(researcher_id):
    
   
     reg = consultar_db('SELECT  count(distinct title) as qtd from bibliographic_production AS b, bibliographic_production_author AS ba '+
                        ' WHERE b.id = ba.bibliographic_production_id '+
                        ' AND researcher_id=\''+researcher_id+"'"+
                        ' AND "type" = \'ARTICLE\'')

     df_bd = pd.DataFrame(reg, columns=['qtd'])

     qtd_article = df_bd['qtd'].iloc[0]   

     reg = consultar_db('SELECT  count(distinct title) as qtd from bibliographic_production AS b, bibliographic_production_author AS ba '+
                        ' WHERE b.id = ba.bibliographic_production_id '+
                        ' AND researcher_id=\''+researcher_id+"'"+
                        ' AND "type" = \'BOOK_CHAPTER\'')

     df_bd = pd.DataFrame(reg, columns=['qtd'])

     qtd_book_chapter = df_bd['qtd'].iloc[0]  

     sql = """
        INSERT into public.researcher_production (researcher_id ,articles,book_chapters) 
        values('%s','%s','%s');
        """ % (researcher_id,qtd_article,qtd_book_chapter)
     execScript_db(sql)

    
     return df_bd

''''
df=researchers_term_db('robo')
df.sort_values(by="qtd", ascending=False, inplace=True)

for i,infos in df.iterrows():
   print(infos)
''' 
print(lista_researcher_name_db("João Santos"))   