from distutils.core import setup
from setuptools import find_packages

setup(
    name='django-taggit-autocomplete-jqueryui',
    version='0.4.0',
    packages=find_packages(),
    include_package_data=True,
    license='BSD License',
    long_description=open('README.txt').read()
)
