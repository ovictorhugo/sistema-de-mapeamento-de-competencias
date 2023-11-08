import nltk
import SimccBD
from nltk.tokenize import RegexpTokenizer
from nltk import bigrams
import jellyfish as jf
import unidecode







# Função para inserir dados no banco
def ntlk_frequencia_db(researcher_id,text):


    tokenize = RegexpTokenizer(r'\w+')
    tokens = tokenize.tokenize(text)

#print( nltk.corpus.stopwords.words('portuguese'))

#print( nltk.corpus.stopwords.words('english'))

    stopwords_portuguese = nltk.corpus.stopwords.words('portuguese')
    stopwords_english = nltk.corpus.stopwords.words('english')

    result = []

    new_text_stem=""
    new_text=[]
    stemmer = nltk.RSLPStemmer()
    lista=[]
    
    for word in tokens:
        if not((word.lower() in stopwords_portuguese) or (word.lower() in stopwords_english)):
            result.append(word)
            #print("---"+word)
            new_text.append(word.lower())
            #new_text_stem = new_text_stem+stemmer.stem(unidecode.unidecode(word))+" "
            new_text_stem = new_text_stem+stemmer.stem(word)+" "
            #print(stemmer.stem(word))
    
    lista = list(set(new_text))
    #print(new_text_stem)
    #new_text_stem = unidecode.unidecode(new_text_stem)
    #print(new_text_stem)

 
    



#print(nltk.word_tokenize(texto))
# Expressões Regulares (exemplo sem pontuação)
#tokenize = RegexpTokenizer(r'\w+')
#print(tokenize.tokenize(texto))
    tokenize = RegexpTokenizer(r'\w+')
    tokens = tokenize.tokenize(new_text_stem)
#frequencia = nltk.FreqDist(tokens)
#print(frequencia.most_common())
#print(frequencia.most_common(2))

    frequencia = nltk.FreqDist(w.lower() for w in tokens)

    #tokenize = RegexpTokenizer(r'\w+')
   # tokens = tokenize.tokenize(new_text)



    print(frequencia.most_common())

    for term in frequencia.most_common():
        #print(term[0])
        #print(term[1])
        originals_words="";
        for word in lista:
            original_word= word
          #  if  term[0]==stemmer.stem(unidecode.unidecode(word)):
            if  term[0]==stemmer.stem(word):
                originals_words = originals_words+" "+original_word;



        sql = """
        INSERT into public.researcher_term  (researcher_id ,term,originals_words,amount) 
        values('%s','%s','%s','%s');
        """ % (researcher_id, term[0],originals_words,term[1])
        SimccBD.execScript_db(sql)








#print(nltk.corpus.stopwords.words('portuguese'))

#print(list(bigrams(tokens)))

#print(jf.levenshtein_distance('gato', 'rato'))

sql = "DELETE FROM researcher_term"
SimccBD.execScript_db(sql)



m=SimccBD.researcher_text_db()
for i in m:
    ntlk_frequencia_db(i[0],i[1])
    
stemmer = nltk.RSLPStemmer()
print(unidecode.unidecode(stemmer.stem('Otologias')))

 