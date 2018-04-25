from collections import Counter
import pandas as pd
import nltk

top_N = 50
num = 0;

df = pd.read_csv(r'UFO_sightings.csv',
                 usecols=['state'])


# replace '|'-->' ' and drop all stopwords
words = (df.state
           .str.lower()
           
)

# generate DF out of Counter
rslt = pd.DataFrame(Counter(words).most_common(top_N),index = None,
                    columns=['State', 'Frequency']).set_index('State')


rslt.to_csv("output.csv")