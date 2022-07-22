"""
# My first app
Here's our first attempt at using data to create a table:
"""

import streamlit as st
st.text('This is some text.')

st.latex(r'''
     a + ar + a r^2 + a r^3 + \cdots + a r^{n-1} =
     \sum_{k=0}^{n-1} ar^k =
     a \left(\frac{1-r^{n}}{1-r}\right)
     ''')
st.snow()
