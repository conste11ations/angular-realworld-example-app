describe("workshop test", () => {
    it("validates elements on the DOM", () => {
        // Visits our application
        cy.visit("/");
        // Selects the header banner via data attribute and validates it contains the text 'conduit'
        cy.get("[data-cy=banner-header]").should("have.text", "conduit");
        // Selects any other two elements on the page and validates the text or style of the element with an assertion
        cy.get(".sidebar > p").should("have.text", "Popular Tags");
        cy.get(".navbar").should("have.class", "navbar-light");
        // Bonus: Use cy.contains() to validate the subheading ('A place to share your Angular knowledge.') WITHOUT selecting a specific element
        cy.contains("A place to share your Angular knowledge.");
    });

    it("network requests", () => {
        // -- Visits the baseUrl
        cy.visit("/");
           // Setup our routes
        cy.server(); // enables response stubbing
        cy.route("POST", "https://conduit.productionready.io/api/users/login").as(
      "login");
        cy.route("POST", "https://conduit.productionready.io/api/articles/").as(
      "publish");
    });

    it("uses commands to sign in and publish new article", () => {
        // Visits our application
        cy.server();
        cy.visit("/"); 
        cy.route("POST", "https://conduit.productionready.io/api/users/login").as(
            "login");
        cy.route("POST", "https://conduit.productionready.io/api/articles/").as(
      "publish");
        // Signs in with credentials
        cy.contains("Sign in").click();
        cy.get(":nth-child(2) > .form-control").type("ngconfentcypress@testemail.com");
        cy.get(":nth-child(3) > .form-control").type("ngConfEntCypress");
        cy.get(":nth-child(2) > .form-control").should("have.value",
      "ngconfentcypress@testemail.com");
        cy.get(":nth-child(3) > .form-control").should("have.value",
      "ngConfEntCypress");
        cy.get(".btn").should("not.be", "disabled").click();
       cy.get(":nth-child(4) > .nav-link").should("contain.text",
            "ngConfEntCypress");
       // -- Asserts the network request status was valid
        cy.wait("@login").its("status").should("equal", 200);
        // Publishes New Article
        cy.contains("New Article").click();
        cy.contains("Publish Article");
        cy.get(":nth-child(1) > .form-control").type("test: Article Title");
        cy.get(":nth-child(2) > .form-control").type("test: Article description");
        cy.get(":nth-child(3) > .form-control").type(
            "Lorem Ipsum"
        );
        cy.get(":nth-child(4) > .form-control").type("tutorial");
        cy.get(".btn").should("not.be", "disabled").click();
        // Asserts network request status was valid
        cy.wait("@publish").its("status").should("equal", 200);
        // -- Asserts DOM changed on click
        cy.contains("Edit Article");
    });
});