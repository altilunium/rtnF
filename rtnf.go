package main

import (
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"regexp"
)


type Page struct {
	Title string
	Body  template.HTML
}


func (p *Page) save() error {
	filename := "db/" + p.Title 
	return ioutil.WriteFile(filename, []byte(p.Body), 0600)



}


func loadPage(title string) (*Page, error) {
	filename := "db/" + title 
	body, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	return &Page{Title: title, Body: template.HTML(body)}, nil
}


func viewHandler(w http.ResponseWriter, r *http.Request, title string) {
	
		p, err := loadPage(title)
		if err != nil {
			http.Redirect(w, r, "/edit/"+title, http.StatusFound)
			return
		}
		renderTemplate(w, "view", p)
	}	



func editHandler(w http.ResponseWriter, r *http.Request, title string) {
	if r.FormValue("body") != "" {
		body := r.FormValue("body")
		p := &Page{Title: title, Body: template.HTML(body)}
		err := p.save()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	} else {
		p, err := loadPage(title)
		if err != nil {
			p = &Page{Title: title}
		}
		renderTemplate(w, "edit", p)
	}
}


func saveHandler(w http.ResponseWriter, r *http.Request, title string) {
	body := r.FormValue("body")
	p := &Page{Title: title, Body: template.HTML(body)}
	err := p.save()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	http.Redirect(w, r, "/n/"+title, http.StatusFound)
}


var templates = template.Must(template.ParseFiles("edit.html", "view.html"))


func renderTemplate(w http.ResponseWriter, tmpl string, p *Page) {
	err := templates.ExecuteTemplate(w, tmpl+".html", p)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}


var validPath = regexp.MustCompile("^/(edit|save|n|r)/([a-zA-Z0-9]+)$")


func makeHandler(fn func(http.ResponseWriter, *http.Request, string)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		m := validPath.FindStringSubmatch(r.URL.Path)
		if m == nil {
			http.NotFound(w, r)
			return
		}
		fn(w, r, m[2])
	}
}


func main() {
	
	http.HandleFunc("/n/", makeHandler(viewHandler))
	http.HandleFunc("/edit/", makeHandler(editHandler))
	http.HandleFunc("/save/", makeHandler(saveHandler))
	

	http.Handle("/r/", http.StripPrefix("/r/", http.FileServer(http.Dir("./r"))))
       


	log.Fatal(http.ListenAndServe(":8080", nil))
}